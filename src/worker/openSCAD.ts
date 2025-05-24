import type WorkspaceFile from "../lib/WorkspaceFile.js";
import OpenSCAD from "../vendor/openscad-wasm/openscad.js";
import type {
	FileSystemWorkerMessageData,
	OpenSCADWorkerMessageData,
	OpenSCADWorkerResponseData,
} from "./types.js";

const fontsConf = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
</fontconfig>
`;

let interNotoFont: ArrayBuffer;
let keycapU: ArrayBuffer;
let keycapO: ArrayBuffer;
let keycapF: ArrayBuffer;
let keycapUMini: ArrayBuffer;
let keycapOMini: ArrayBuffer;
let keycapFMini: ArrayBuffer;
let loadedAssets = false;

class OpenSCADWrapper {
	log = {
		stdErr: [],
		stdOut: [],
	};

	files: WorkspaceFile[] = [];

	async getInstance(): Promise<OpenSCAD> {
		const instance = await OpenSCAD({
			noInitialRun: true,
			print: this.logger("stdOut"),
			printErr: this.logger("stdErr"),
		});
		if (!loadedAssets) {
			const interNotoFontResponse = await fetch(
				"Inter-18pt-Noto-Regular.ttf",
			);
			interNotoFont = await interNotoFontResponse.arrayBuffer();
			// 18mm
			const keycapUResponse = await fetch("Cap_U.stl");
			keycapU = await keycapUResponse.arrayBuffer();
			const keycapOResponse = await fetch("Cap_O.stl");
			keycapO = await keycapOResponse.arrayBuffer();
			const keycapFResponse = await fetch("Cap_F.stl");
			keycapF = await keycapFResponse.arrayBuffer();
			// 16mm
			const keycapUMiniResponse = await fetch("Cap_U_Mini.stl");
			keycapUMini = await keycapUMiniResponse.arrayBuffer();
			const keycapOMiniResponse = await fetch("Cap_O_Mini.stl");
			keycapOMini = await keycapOMiniResponse.arrayBuffer();
			const keycapFMiniResponse = await fetch("Cap_F_Mini.stl");
			keycapFMini = await keycapFMiniResponse.arrayBuffer();

			loadedAssets = true;
		}

		// Make sure the root directory exists
		this.createDirectoryRecusive(instance, "fonts");

		// Write the font.conf file
		instance.FS.writeFile("/fonts/fonts.conf", fontsConf);

		// Add fonts
		instance.FS.writeFile(
			"fonts/Inter-Noto-Regular.ttf",
			new Int8Array(interNotoFont),
		);

		// Add keycap files
		instance.FS.writeFile("Cap_U.stl", new Int8Array(keycapU));
		instance.FS.writeFile("Cap_O.stl", new Int8Array(keycapO));
		instance.FS.writeFile("Cap_F.stl", new Int8Array(keycapF));
		instance.FS.writeFile("Cap_U_Mini.stl", new Int8Array(keycapUMini));
		instance.FS.writeFile("Cap_O_Mini.stl", new Int8Array(keycapOMini));
		instance.FS.writeFile("Cap_F_Mini.stl", new Int8Array(keycapFMini));

		for (const file of this.files) {
			// Make sure the directory of the file exists
			const path = file.path.split("/");
			path.pop();
			const dir = path.join("/");

			if (dir && !this.fileExists(instance, dir)) {
				this.createDirectoryRecusive(instance, dir);
			}

			const content = await file.arrayBuffer();
			instance.FS.writeFile(file.path, new Int8Array(content));
		}

		return instance;
	}

	fileExists(instance, path: string) {
		try {
			instance.FS.stat(path);
			return true;
		} catch (err) {
			return false;
		}
	}

	createDirectoryRecusive(instance, path: string) {
		const parts = path.split("/");
		let currentPath = "";

		for (const part of parts) {
			currentPath += `/${part}`;

			if (!this.fileExists(instance, currentPath)) {
				instance.FS.mkdir(currentPath);
			}
		}
	}

	logger = (type) => (text: string) => {
		this.log[type].push(text);
	};

	/**
	 * @param data
	 * @returns
	 */
	async exportFile(
		data: OpenSCADWorkerMessageData,
	): Promise<OpenSCADWorkerResponseData> {
		const exportParams = [
			"--export-format=binstl",
			"--enable=manifold",
			"--enable=fast-csg",
			"--enable=lazy-union",
		];

		return await this.executeOpenscad(data.code, exportParams);
	}

	/**
	 * @param data
	 * @returns
	 */
	async preview(
		data: OpenSCADWorkerMessageData,
	): Promise<OpenSCADWorkerResponseData> {
		const exportParams = [
			"--export-format=binstl",
			"--enable=manifold",
			"--enable=fast-csg",
			"--enable=lazy-union",
			"--enable=roof",
		];

		const render = await this.executeOpenscad(data.code, exportParams);

		return render;
	}

	async writeFile(data: FileSystemWorkerMessageData) {
		// XXX Because of a bug I haven't figured out yet, where OpenSCAD would throw
		// a number as an error, we cannot use a persistent instance of OpenSCAD. Instead,
		// we have to create a new instance every time we want to use OpenSCAD. That is
		// why the files are stored in this class, instead of written to the FS of OpenSCAD.

		this.files = this.files.filter((file) => file.name !== data.path);
		this.files.push(data.content);

		if (!data.content.path) {
			data.content.path = data.path;
		}

		return true; // TODO `boolean` might not be the best thing to return here
	}

	async readFile(
		data: FileSystemWorkerMessageData,
	): Promise<FileSystemWorkerMessageData> {
		const found = this.files.find((file) => file.name === data.path);

		return {
			path: data.path,
			content: found,
		};
	}

	async unlinkFile(data: FileSystemWorkerMessageData) {
		this.files = this.files.filter((file) => file.name !== data.path);

		return true; // TODO `boolean` might not be the best thing to return here
	}

	/**
	 * @param code Code for the OpenSCAD input file
	 * @param parameters array of parameters to pass to OpenSCAD
	 * @returns
	 */
	async executeOpenscad(
		code: string,
		parameters: string[],
	): Promise<OpenSCADWorkerResponseData> {
		const start = Date.now();

		// Reset log
		this.log.stdErr = [];
		this.log.stdOut = [];

		const inputFile = "/input.scad";
		const outputFile = "/out.stl";
		const instance = await this.getInstance();

		// Write the code to a file
		instance.FS.writeFile(inputFile, code);

		const args = [inputFile, "-o", outputFile, ...parameters];
		let exitCode: number;
		let output: Uint8Array;

		try {
			exitCode = instance.callMain(args);
		} catch (error) {
			throw new Error(
				`OpenSCAD exited with an error: ${
					error.message ? error.message : error
				}`,
			);
		}

		if (exitCode === 0) {
			try {
				output = instance.FS.readFile(outputFile);
			} catch (error) {
				throw new Error(
					`OpenSCAD cannot read created file: ${error.message}`,
				);
			}
		}

		return {
			output,
			exitCode,
			duration: Date.now() - start,
			log: this.log,
		};
	}

	escapeShell(cmd: string) {
		return `"${cmd.replace(/(["'$`\\])/g, "\\$1")}"`;
	}
}

export default OpenSCADWrapper;

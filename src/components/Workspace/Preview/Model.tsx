import { Center } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import type * as THREE from "three";

type Props = JSX.IntrinsicElements["mesh"] & {
	geometry: THREE.Group;
};

export default function Model({ geometry, ...props }: Props) {
	const groupRef = useRef<THREE.Group>();
	const [loading, setLoading] = React.useState<boolean>(true);

	useEffect(() => {
		groupRef.current?.clear();
		groupRef.current?.add(geometry);
		setLoading(false);
	}, [geometry]);

	return (
		// Center object
		<Center cacheKey={loading ? "loading" : "not_loading"} disableY>
			{/* eslint-disable-next-line react/no-unknown-property */}
			<mesh castShadow receiveShadow {...props}>
				<group ref={groupRef} />
			</mesh>
		</Center>
	);
}

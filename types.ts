
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface Laureate {
  name: string;
  image: string; // placeholder url
  role: string;
  desc: string;
}

// Global augmentation for JSX Intrinsic Elements to support @react-three/fiber components
// and standard HTML/SVG elements where default types might be missing or overridden.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js elements
      mesh: any;
      group: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      directionalLight: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhysicalMaterial: any;
      cylinderGeometry: any;
      sphereGeometry: any;
      boxGeometry: any;
      planeGeometry: any;
      torusGeometry: any;
      instancedMesh: any;
      fog: any;
      color: any;
      primitive: any;
      object3D: any;

      // Standard HTML elements
      div: any;
      span: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      a: any;
      button: any;
      ul: any;
      ol: any;
      li: any;
      nav: any;
      header: any;
      footer: any;
      main: any;
      section: any;
      article: any;
      aside: any;
      br: any;
      hr: any;
      input: any;
      label: any;
      form: any;
      img: any;
      strong: any;
      b: any;
      i: any;
      em: any;

      // SVG elements
      svg: any;
      path: any;
      circle: any;
      rect: any;
      line: any;
      polyline: any;
      polygon: any;
      g: any;
      text: any;
      defs: any;
      marker: any;
      linearGradient: any;
      stop: any;
      foreignObject: any;
      ellipse: any;
      animate: any;
      animateTransform: any;
      style: any;
    }
  }
}

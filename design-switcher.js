import * as THREE from "three";

const canvas = document.getElementById("design-switcher");
if (canvas) {
 const style = getComputedStyle(document.body);
 const readColor = (primary, fallback, backup) => style.getPropertyValue(primary).trim() || style.getPropertyValue(fallback).trim() || backup;
 const hot = new THREE.Color(readColor("--hot", "--neon", "#ff4385"));
 const cool = new THREE.Color(readColor("--cool", "--cyan", "#41d9df"));
 const oldHref = canvas.dataset.originalHref || "original-design.html#top";
 const newHref = canvas.dataset.cinemaHref || "index.html#top";
 let renderer;
 try {
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const fallback = canvas.parentElement.querySelector(".orb");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.z = 8.2;
  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const key = new THREE.DirectionalLight(cool, 2.5); key.position.set(3, 3, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(hot, 1.9); fill.position.set(-3, -2, 3); scene.add(fill);

  const original = new THREE.Group();
  original.position.x = -1.45;
  original.userData.designHref = oldHref;
  original.add(new THREE.Mesh(
   new THREE.TorusKnotGeometry(0.72, 0.23, 144, 20, 2, 3),
   new THREE.MeshStandardMaterial({color:hot, metalness:0.38, roughness:0.28})
  ));
  original.add(new THREE.Mesh(
   new THREE.IcosahedronGeometry(1.3, 1),
   new THREE.MeshBasicMaterial({color:cool, wireframe:true, transparent:true, opacity:0.46})
  ));
  scene.add(original);

  const cinema = new THREE.Group();
  const reelSpools = [], filmShards = [];
  cinema.position.x = 1.45;
  cinema.scale.setScalar(1.22);
  cinema.userData.designHref = newHref;
  const bodyMaterial = new THREE.MeshStandardMaterial({color:hot, metalness:0.62, roughness:0.34});
  const trimMaterial = new THREE.MeshStandardMaterial({color:cool, metalness:0.55, roughness:0.26, emissive:cool, emissiveIntensity:0.08});
  const accentMaterial = new THREE.MeshStandardMaterial({color:hot, metalness:0.48, roughness:0.25, emissive:hot, emissiveIntensity:0.08});
  cinema.add(new THREE.Mesh(new THREE.BoxGeometry(1.08,0.62,0.5), bodyMaterial));
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.48,0.12,0.2), trimMaterial); top.position.set(0,0.38,0); cinema.add(top);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.1,0.3), bodyMaterial); base.position.set(0,-0.37,0); cinema.add(base);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.36,0.58,48), accentMaterial); lens.rotation.x=Math.PI/2; lens.position.set(0,-0.03,0.44); cinema.add(lens);
  const lensRim = new THREE.Mesh(new THREE.TorusGeometry(0.31,0.055,12,64), trimMaterial); lensRim.position.set(0,-0.03,0.75); cinema.add(lensRim);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.245,48), new THREE.MeshStandardMaterial({color:0x10191b, metalness:0.78, roughness:0.16, emissive:cool, emissiveIntensity:0.18})); glass.position.set(0,-0.03,0.76); cinema.add(glass);
  const innerRim = new THREE.Mesh(new THREE.TorusGeometry(0.19,0.018,8,48), accentMaterial); innerRim.position.set(0,-0.03,0.77); cinema.add(innerRim);
  const display = new THREE.Mesh(new THREE.BoxGeometry(0.17,0.12,0.025), trimMaterial); display.position.set(-0.34,0.12,0.265); cinema.add(display);
  for (const [x, material] of [[-0.34,accentMaterial],[0.34,trimMaterial]]) {
   const reel = new THREE.Group(); reel.position.set(x,0.61,0.02);
   reel.add(new THREE.Mesh(new THREE.TorusGeometry(0.31,0.045,12,56), material));
   reel.add(new THREE.Mesh(new THREE.TorusGeometry(0.105,0.025,10,40), accentMaterial));
   const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.065,0.08,24), bodyMaterial); hub.rotation.x=Math.PI/2; hub.position.z=0.02; reel.add(hub);
   for(let spoke=0;spoke<3;spoke++){const angle=spoke*Math.PI*2/3;const bar=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.20,0.025), material);bar.position.set(Math.cos(angle)*0.19,Math.sin(angle)*0.19,0.015);bar.rotation.z=angle+Math.PI/2;reel.add(bar);}
   reelSpools.push(reel);
   cinema.add(reel);
  }
  const beamMaterial = new THREE.MeshBasicMaterial({color:hot, transparent:true, opacity:0.14, side:THREE.DoubleSide, depthWrite:false});
  const lightBeam = new THREE.Mesh(new THREE.ConeGeometry(0.88,1.8,36,1,true), beamMaterial); lightBeam.rotation.x=-Math.PI/2; lightBeam.position.set(0,-0.03,1.62); cinema.add(lightBeam);
  const flashMaterial = new THREE.MeshBasicMaterial({color:0xffe2a1, transparent:true, opacity:0.78});
  const flash = new THREE.Mesh(new THREE.SphereGeometry(0.13,24,16),flashMaterial); flash.position.set(0,-0.03,0.84); cinema.add(flash);
  const beamLight=new THREE.PointLight(hot,1.8,3.2);beamLight.position.set(0,-0.03,1.15);cinema.add(beamLight);
  for(let i=0;i<18;i++){
   const material=new THREE.MeshStandardMaterial({color:i%2?hot:cool,emissive:i%2?hot:cool,emissiveIntensity:0.45,metalness:0.35,roughness:0.32});
   const shard=new THREE.Mesh(new THREE.BoxGeometry(0.11+(i%3)*0.025,0.075+(i%2)*0.02,0.035),material);
   const angle=i*2.399, depth=0.92+(i%6)*0.22, spread=0.18+(depth-0.92)*0.34;
   shard.position.set(Math.cos(angle)*spread,Math.sin(angle)*spread-0.03,depth);
   shard.rotation.set(angle*0.3,angle*0.2,angle);
   shard.userData={baseX:shard.position.x,baseY:shard.position.y,baseZ:depth,phase:i*0.73,speed:0.7+(i%4)*0.18};
   filmShards.push(shard);cinema.add(shard);
  }
  scene.add(cinema);
  if (fallback) fallback.hidden = true;

  const designs = [original, cinema];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motion.matches, visible = true, raf = 0;
  function render(){renderer.render(scene,camera);}
  function resize(){const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;renderer.setSize(box.width,box.height,false);camera.aspect=box.width/box.height;camera.position.z=box.width/box.height<1.05?9:8.2;camera.updateProjectionMatrix();render();}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=0;}}
  function animate(){raf=0;if(reduced||!visible||document.hidden)return;const t=performance.now()*0.001;original.rotation.y+=0.004;original.rotation.x+=0.0015;cinema.rotation.y-=0.005;cinema.rotation.x+=0.002;reelSpools[0].rotation.z+=0.035;reelSpools[1].rotation.z-=0.04;flash.scale.setScalar(0.75+0.35*(0.5+0.5*Math.sin(t*5)));flashMaterial.opacity=0.46+0.32*(0.5+0.5*Math.sin(t*5));beamMaterial.opacity=0.09+0.05*(0.5+0.5*Math.sin(t*2.7));for(const shard of filmShards){const p=shard.userData;shard.position.x=p.baseX+Math.sin(t*p.speed+p.phase)*0.055;shard.position.y=p.baseY+Math.cos(t*p.speed+p.phase)*0.07;shard.position.z=p.baseZ+Math.sin(t*1.5+p.phase)*0.09;shard.rotation.z+=0.012*p.speed;}render();raf=requestAnimationFrame(animate);}
  function start(){if(!reduced&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(animate);}
  function point(event){const box=canvas.getBoundingClientRect();pointer.x=((event.clientX-box.left)/box.width)*2-1;pointer.y=-((event.clientY-box.top)/box.height)*2+1;raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(designs,true);}
  function targetFor(object){while(object&&!object.userData.designHref)object=object.parent;return object&&object.userData.designHref;}
  canvas.addEventListener("pointermove",event=>{canvas.style.cursor=point(event).some(hit=>targetFor(hit.object))?"pointer":"default";});
  canvas.addEventListener("click",event=>{const hit=point(event).find(item=>targetFor(item.object));if(hit){const target=targetFor(hit.object);if(target)window.location.href=target;}});
  canvas.addEventListener("keydown",event=>{if(event.key==="ArrowLeft"){original.rotation.y+=0.12;render();}else if(event.key==="ArrowRight"){cinema.rotation.y-=0.12;render();}else if(event.key==="Enter"){window.location.href=event.shiftKey?oldHref:newHref;}else return;event.preventDefault();});
  motion.addEventListener?.("change",event=>{reduced=event.matches;if(reduced)stop();else start();});
  if("ResizeObserver" in window)new ResizeObserver(resize).observe(canvas.parentElement);else window.addEventListener("resize",resize);
  if("IntersectionObserver" in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();}).observe(canvas);
  document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
  canvas.addEventListener("webglcontextlost",event=>{event.preventDefault();stop();});
  resize();start();
 } catch(error) {
  console.warn("Interactive design selector unavailable; use the design links below.",error);
  if(renderer)renderer.dispose();
  canvas.hidden=true;
 }
}








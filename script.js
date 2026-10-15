import * as THREE from "three";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const preloader = document.querySelector("#preloader");
const progress = document.querySelector("#loader-progress");
const percent = document.querySelector("#loader-percent");
document.body.classList.add("loading");
let loadValue = 0;
const loaderTimer = setInterval(() => {
  loadValue = Math.min(100, loadValue + (loadValue < 65 ? 7 : 3));
  progress.style.width = `${loadValue}%`;
  percent.textContent = `${String(loadValue).padStart(2, "0")}%`;
  if (loadValue >= 100) {
    clearInterval(loaderTimer);
    setTimeout(() => {
      preloader.classList.add("done");
      document.body.classList.remove("loading");
      document.querySelectorAll(".section").forEach(el => el.classList.add("reveal"));
      requestAnimationFrame(() => document.querySelectorAll(".section").forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight * .9) el.classList.add("visible");
      }));
    }, 250);
  }
}, 38);

const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const aura = document.querySelector("#cursor-aura");
if (matchMedia("(pointer:fine)").matches && !reducedMotion) {
  window.addEventListener("pointermove", e => {
    aura.style.left = `${e.clientX}px`; aura.style.top = `${e.clientY}px`; aura.style.opacity = ".8";
  }, {passive:true});
  document.addEventListener("pointerleave", () => aura.style.opacity = "0");
}

// Subtle Three.js star field. CSS planets and section illustrations remain as a graceful fallback.
try {
  const canvas = document.querySelector("#universe");
  if (!reducedMotion && canvas && window.WebGLRenderingContext) {
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
    camera.position.z = 24;
    const count = 1250;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i=0;i<count;i++) {
      positions[i*3] = (Math.random()-.5)*62;
      positions[i*3+1] = (Math.random()-.5)*42;
      positions[i*3+2] = (Math.random()-.5)*34;
      const cool = Math.random();
      colors[i*3] = .55 + cool*.35;
      colors[i*3+1] = .58 + cool*.35;
      colors[i*3+2] = .8 + cool*.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions,3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors,3));
    const material = new THREE.PointsMaterial({size:.055, vertexColors:true, transparent:true, opacity:.82, sizeAttenuation:true});
    const stars = new THREE.Points(geo, material);
    scene.add(stars);
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(250*3);
    for(let i=0;i<250;i++){dustPositions[i*3]=(Math.random()-.5)*48;dustPositions[i*3+1]=(Math.random()-.5)*34;dustPositions[i*3+2]=(Math.random()-.5)*24;}
    dustGeo.setAttribute("position",new THREE.BufferAttribute(dustPositions,3));
    const dust = new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0x9d9bff,size:.11,transparent:true,opacity:.35}));
    scene.add(dust);
    let pointerX=0,pointerY=0;
    window.addEventListener("pointermove",e=>{pointerX=(e.clientX/innerWidth-.5)*.45;pointerY=(e.clientY/innerHeight-.5)*.3},{passive:true});
    let raf;
    const render = () => {
      raf = requestAnimationFrame(render);
      stars.rotation.y += .00012; stars.rotation.x += .00004;
      dust.rotation.y -= .00008;
      camera.position.x += (pointerX-camera.position.x)*.012;
      camera.position.y += (-pointerY-camera.position.y)*.012;
      renderer.render(scene,camera);
    };
    render();
    window.addEventListener("resize",()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();},{passive:true});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(raf);else render();});
  }
} catch (err) {
  // The page is intentionally usable even when WebGL or the external module is unavailable.
  console.info("3D background fallback active.");
}

// Reveal sections as they enter view.
if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), {threshold:.08});
  document.querySelectorAll(".section").forEach(section => observer.observe(section));
} else {
  document.querySelectorAll(".section").forEach(section => section.classList.add("visible"));
}

// Interactive project journey constellation.
const milestones = [
  {date:"AUGUST 2026",title:"Starting with an idea",text:"The beginning of the Naa College and Plantmokk AI project journey — learning by making real things."},
  {date:"PROJECT BUILDING",title:"Naa College grows",text:"A student-focused education platform bringing together admissions tools, scholarships, attendance planning, internships, roadmaps and practical utilities."},
  {date:"COLLEGE ACHIEVEMENTS",title:"Building beyond the screen",text:"Earned 2nd place in the college general quiz and 3rd prize at the college Project Expo for the Naa College website."}
];
let milestoneIndex=0;
const countEl=document.querySelector("#journey-count"),dateEl=document.querySelector("#journey-date"),titleEl=document.querySelector("#journey-title"),textEl=document.querySelector("#journey-text"),dots=[...document.querySelectorAll("#journey-dots button")];
function showMilestone(index){
  milestoneIndex=(index+milestones.length)%milestones.length;
  const m=milestones[milestoneIndex];
  countEl.textContent=`MILESTONE ${String(milestoneIndex+1).padStart(2,"0")} / ${String(milestones.length).padStart(2,"0")}`;
  dateEl.textContent=m.date;titleEl.textContent=m.title;textEl.textContent=m.text;
  dots.forEach((dot,i)=>dot.classList.toggle("active",i===milestoneIndex));
}
document.querySelector("#journey-prev").addEventListener("click",()=>showMilestone(milestoneIndex-1));
document.querySelector("#journey-next").addEventListener("click",()=>showMilestone(milestoneIndex+1));
dots.forEach((dot,i)=>dot.addEventListener("click",()=>showMilestone(i)));

// Filterable skill cloud.
document.querySelectorAll(".skill-filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".skill-filter").forEach(b=>b.classList.toggle("active",b===button));
  const filter=button.dataset.filter;
  document.querySelectorAll(".skill-node").forEach(node=>node.classList.toggle("hidden",filter!=="all"&&node.dataset.category!==filter));
}));

// Smooth anchor navigation with keyboard-friendly focus target.
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",event=>{
  const target=document.querySelector(link.getAttribute("href"));
  if(target){event.preventDefault();target.scrollIntoView({behavior:reducedMotion?"auto":"smooth",block:"start"});}
}));

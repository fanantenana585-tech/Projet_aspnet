import{c as r}from"./createLucideIcon-BUuuseSU.js";import{J as m}from"./index-ipXGJJqN.js";/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=r("ArrowRightIcon",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=r("ChevronLeftIcon",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=r("ChevronUpIcon",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=r("FileOutputIcon",[["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2",key:"1vk7w2"}],["path",{d:"M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6",key:"1jink5"}],["path",{d:"m5 11-3 3",key:"1dgrs4"}],["path",{d:"m5 17-3-3h10",key:"1mvvaf"}]]);/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=r("Grid3x3Icon",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=r("MessageSquareIcon",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=r("ZoomInIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-vue-next v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=r("ZoomOutIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]),x=m("emploi",{state:()=>({emplois:[],creneauSelectionne:null,filtres:{mention:"toutes",parcours:"tous",niveau:"tous",groupe:"tous",enseignant:"tous",salle:"toutes",type:"tous"},semaineCourante:new Date("2026-06-15"),loading:!1,modeVue:"semaine",drawerOuvert:!1,modalOuverte:!1,creneauEnEdition:null,donneesParDefaut:null,printModalOuverte:!1,pixelsParMinute:1.2,conflits:[],conflitsIgnores:!1}),getters:{emploisFiltres:e=>e.emplois.filter(t=>{const n=e.filtres.mention==="toutes"||t.mention.id===e.filtres.mention,i=e.filtres.parcours==="tous"||t.parcours.id===e.filtres.parcours,s=e.filtres.niveau==="tous"||t.niveau===e.filtres.niveau,o=e.filtres.type==="tous"||t.type===e.filtres.type,a=e.filtres.enseignant==="tous"||t.enseignant.id===e.filtres.enseignant,u=e.filtres.salle==="tous"||t.salle.id===e.filtres.salle;return n&&i&&s&&o&&a&&u}),numeroSemaine:e=>25,dateDebutSemaine:e=>new Date(e.semaineCourante).toLocaleDateString("fr-FR",{day:"numeric",month:"long"}),dateFinSemaine:e=>{const t=new Date(e.semaineCourante);return t.setDate(t.getDate()+5),t.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})},chargesEnseignants:e=>{const t={};return e.emplois.forEach(n=>{t[n.enseignant.id]||(t[n.enseignant.id]=0);const i=n.heureDebut.split(":").map(Number),s=n.heureFin.split(":").map(Number),o=s[0]*60+s[1]-(i[0]*60+i[1]);t[n.enseignant.id]+=o/60}),t}},actions:{detecterConflits(){this.conflits=[];const e=this.emplois;for(let t=0;t<e.length;t++)for(let n=t+1;n<e.length;n++){const i=e[t],s=e[n];i.jour===s.jour&&this.chevauchement(i,s)&&(i.enseignant.id===s.enseignant.id&&this.conflits.push({id:Date.now()+t+n,type:"Enseignant",message:`${i.enseignant.prenom} ${i.enseignant.nom} est déjà en cours (${i.matiere.code} et ${s.matiere.code}) le ${i.jour} à ${i.heureDebut}`}),i.salle.id===s.salle.id&&this.conflits.push({id:Date.now()+t+n+1,type:"Salle",message:`La salle ${i.salle.nom} est occupée par ${i.matiere.code} et ${s.matiere.code} le ${i.jour} à ${i.heureDebut}`}),i.parcours.id===s.parcours.id&&i.niveau===s.niveau&&(i.groupe===s.groupe||!i.groupe||!s.groupe)&&this.conflits.push({id:Date.now()+t+n+2,type:"Groupe",message:`Le groupe ${i.parcours.code} ${i.niveau} a deux cours en même temps (${i.matiere.code} et ${s.matiere.code})`}))}},chevauchement(e,t){const n=u=>{const[l,c]=u.split(":").map(Number);return l*60+c},i=n(e.heureDebut),s=n(e.heureFin),o=n(t.heureDebut),a=n(t.heureFin);return Math.max(i,o)<Math.min(s,a)},async fetchEmplois(){this.loading=!0;try{const e=await fetch("/api/emploidutemps");if(e.ok){const t=await e.json();this.emplois=t.map(n=>({id:n.id,heureDebut:new Date(n.startTime).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}),heureFin:new Date(n.endTime).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}),jour:new Date(n.startTime).toLocaleDateString("fr-FR",{weekday:"long"}),matiere:{nom:n.title,code:n.title.split(" ")[0]},enseignant:{nom:n.enseignant},salle:{nom:n.salle},type:n.type}))}}catch(e){console.error("fetchEmplois error",e)}finally{this.loading=!1,this.detecterConflits()}},async ajouterCreneau(e){try{const t={title:e.matiere.nom,startTime:new Date(`2026-06-15T${e.heureDebut}`),endTime:new Date(`2026-06-15T${e.heureFin}`),salle:e.salle.nom,enseignant:e.enseignant.nom,type:e.type},n=await fetch("/api/emploidutemps",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(n.ok){const i=await n.json();this.emplois.push(e),this.detecterConflits()}}catch(t){console.error("ajouterCreneau error",t)}},async modifierCreneau(e,t){try{if((await fetch(`/api/emploidutemps/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).ok){const i=this.emplois.findIndex(s=>s.id===e);i!==-1&&(this.emplois[i]={...this.emplois[i],...t},this.detecterConflits())}}catch(n){console.error("modifierCreneau error",n)}},async supprimerCreneau(e,t=!1){try{const n=`/api/emploidutemps/${e}${t?"?recurrent=true":""}`;if((await fetch(n,{method:"DELETE"})).ok){const s=this.emplois.find(o=>o.id===e);if(!s)return;t&&s.recurrent?this.emplois=this.emplois.filter(o=>!(o.matiere.id===s.matiere.id&&o.jour===s.jour)):this.emplois=this.emplois.filter(o=>o.id!==e),this.detecterConflits()}}catch(n){console.error("supprimerCreneau error",n)}},changerSemaine(e){const t=new Date(this.semaineCourante);t.setDate(t.getDate()+e*7),this.semaineCourante=t},ouvrirModal(e=null,t=null){this.creneauEnEdition=e?{...e}:null,this.donneesParDefaut=t,this.modalOuverte=!0},fermerModal(){this.modalOuverte=!1},setZoom(e){this.pixelsParMinute=Math.max(.8,Math.min(2.5,e))}}});export{d as A,f as C,g as F,D as G,k as M,v as Z,y as a,w as b,x as u};

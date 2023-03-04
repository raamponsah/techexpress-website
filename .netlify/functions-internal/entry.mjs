import * as adapter from '@astrojs/netlify/netlify-functions.js';
import React, { createElement } from 'react';
import ReactDOM from 'react-dom/server';
import { h as server_default, i as deserializeManifest } from './chunks/astro.b68fd94e.mjs';
import { _ as _page0, a as _page1, b as _page2, c as _page3 } from './chunks/pages/all.38c4d6ac.mjs';
import 'mime';
import 'cookie';
import 'html-escaper';
import 'kleur/colors';
import 'slash';
import 'path-to-regexp';
import 'string-width';
import 'sharp';
/* empty css                                 */import 'node:fs/promises';
import 'node:path';
import 'node:url';
import 'http-cache-semantics';
import 'node:os';
import 'image-size';
import 'magic-string';
import 'node:stream';
/* empty css                                    */import 'react/jsx-runtime';
/* empty css                                 *//* empty css                                 */
/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	const newChildren = children ?? props.children;
	if (newChildren != null) {
		newProps.children = React.createElement(StaticHtml, { value: newChildren });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check,
	renderToStaticMarkup,
};

const pageMap = new Map([["node_modules/@astrojs/image/dist/endpoint.js", _page0],["src/pages/index.astro", _page1],["src/pages/services.astro", _page2],["src/pages/about.astro", _page3],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/about.69173a35.css","_astro/index.1d321ddf.css"],"scripts":[{"type":"inline","value":"const i=document.querySelector(\"button\"),y=[{name:\"Home\",link:\"/\"},{name:\"About\",link:\"/about\"},{name:\"Services\",link:\"/services\"}],e=document.createElement(\"div\");e.classList.add(\"content\");e.style.display=\"none\";e.style.position=\"fixed\";e.style.top=\"0\";e.style.left=\"0\";e.style.width=\"100%\";e.style.height=\"100%\";e.style.zIndex=\"5000\";e.style.backgroundColor=\"#000000\";e.style.opacity=\"0.9\";e.style.display=\"flex\";e.style.justifyContent=\"center\";e.style.alignItems=\"center\";e.style.flexDirection=\"column\";const l=document.createElement(\"ul\");l.style.listStyle=\"none\";l.style.padding=\"0\";l.style.margin=\"0\";l.style.display=\"flex\";l.style.flexDirection=\"column\";l.style.justifyContent=\"center\";l.style.alignItems=\"center\";l.style.textAlign=\"center\";l.style.fontSize=\"2rem\";l.style.color=\"#fff\";l.style.textTransform=\"uppercase\";l.style.letterSpacing=\"0.2rem\";l.style.textShadow=\"0 0 1rem #000\";const n=document.createElement(\"div\"),t=document.createElement(\"button\");t.innerHTML=`<svg width=\"42\" height=\"42\" viewBox=\"0 0 42 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M16.0475 25.9525L25.9525 16.0475M25.9525 25.9525L16.0475 16.0475M15.75 38.5H26.25C35 38.5 38.5 35 38.5 26.25V15.75C38.5 7 35 3.5 26.25 3.5H15.75C7 3.5 3.5 7 3.5 15.75V26.25C3.5 35 7 38.5 15.75 38.5Z\" stroke=\"#0EC0DD\" stroke-opacity=\"0.9\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n`;t.style.position=\"absolute\";t.style.top=\"0\";t.style.right=\"0\";t.style.zIndex=\"5001\";t.style.backgroundColor=\"transparent\";t.style.border=\"none\";t.style.outline=\"none\";t.style.cursor=\"pointer\";t.style.padding=\"1rem\";t.style.margin=\"1rem\";t.style.display=\"none\";n.appendChild(t);n.classList.add(\"overlay\");n.style.display=\"none\";n.style.backgroundColor=\"#000000\";n.style.position=\"fixed\";n.style.top=\"0\";n.style.left=\"0\";n.style.width=\"100%\";n.style.height=\"100%\";n.style.zIndex=\"5000\";n.style.opacity=\"0.9\";document.body.appendChild(n);n.appendChild(e);e.appendChild(l);y.map(o=>{const s=document.createElement(\"li\");s.style.margin=\"1rem 0\",s.innerHTML=`<a href=\"${o.link}\" class=\"menu-item\">${o.name}</a>`,l.appendChild(s)});i.addEventListener(\"click\",()=>{console.log(\"first\"),n.style.display=\"block\",e.appendChild(l),t.style.display=\"block\"});t.addEventListener(\"click\",()=>{n.style.display=\"none\",t.style.display=\"none\"});\n"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/about.69173a35.css","_astro/services.4cb35308.css"],"scripts":[{"type":"inline","value":"const i=document.querySelector(\"button\"),y=[{name:\"Home\",link:\"/\"},{name:\"About\",link:\"/about\"},{name:\"Services\",link:\"/services\"}],e=document.createElement(\"div\");e.classList.add(\"content\");e.style.display=\"none\";e.style.position=\"fixed\";e.style.top=\"0\";e.style.left=\"0\";e.style.width=\"100%\";e.style.height=\"100%\";e.style.zIndex=\"5000\";e.style.backgroundColor=\"#000000\";e.style.opacity=\"0.9\";e.style.display=\"flex\";e.style.justifyContent=\"center\";e.style.alignItems=\"center\";e.style.flexDirection=\"column\";const l=document.createElement(\"ul\");l.style.listStyle=\"none\";l.style.padding=\"0\";l.style.margin=\"0\";l.style.display=\"flex\";l.style.flexDirection=\"column\";l.style.justifyContent=\"center\";l.style.alignItems=\"center\";l.style.textAlign=\"center\";l.style.fontSize=\"2rem\";l.style.color=\"#fff\";l.style.textTransform=\"uppercase\";l.style.letterSpacing=\"0.2rem\";l.style.textShadow=\"0 0 1rem #000\";const n=document.createElement(\"div\"),t=document.createElement(\"button\");t.innerHTML=`<svg width=\"42\" height=\"42\" viewBox=\"0 0 42 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M16.0475 25.9525L25.9525 16.0475M25.9525 25.9525L16.0475 16.0475M15.75 38.5H26.25C35 38.5 38.5 35 38.5 26.25V15.75C38.5 7 35 3.5 26.25 3.5H15.75C7 3.5 3.5 7 3.5 15.75V26.25C3.5 35 7 38.5 15.75 38.5Z\" stroke=\"#0EC0DD\" stroke-opacity=\"0.9\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n`;t.style.position=\"absolute\";t.style.top=\"0\";t.style.right=\"0\";t.style.zIndex=\"5001\";t.style.backgroundColor=\"transparent\";t.style.border=\"none\";t.style.outline=\"none\";t.style.cursor=\"pointer\";t.style.padding=\"1rem\";t.style.margin=\"1rem\";t.style.display=\"none\";n.appendChild(t);n.classList.add(\"overlay\");n.style.display=\"none\";n.style.backgroundColor=\"#000000\";n.style.position=\"fixed\";n.style.top=\"0\";n.style.left=\"0\";n.style.width=\"100%\";n.style.height=\"100%\";n.style.zIndex=\"5000\";n.style.opacity=\"0.9\";document.body.appendChild(n);n.appendChild(e);e.appendChild(l);y.map(o=>{const s=document.createElement(\"li\");s.style.margin=\"1rem 0\",s.innerHTML=`<a href=\"${o.link}\" class=\"menu-item\">${o.name}</a>`,l.appendChild(s)});i.addEventListener(\"click\",()=>{console.log(\"first\"),n.style.display=\"block\",e.appendChild(l),t.style.display=\"block\"});t.addEventListener(\"click\",()=>{n.style.display=\"none\",t.style.display=\"none\"});\n"}],"routeData":{"route":"/services","type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/about.69173a35.css","_astro/about.7ec3d693.css"],"scripts":[{"type":"inline","value":"const i=document.querySelector(\"button\"),y=[{name:\"Home\",link:\"/\"},{name:\"About\",link:\"/about\"},{name:\"Services\",link:\"/services\"}],e=document.createElement(\"div\");e.classList.add(\"content\");e.style.display=\"none\";e.style.position=\"fixed\";e.style.top=\"0\";e.style.left=\"0\";e.style.width=\"100%\";e.style.height=\"100%\";e.style.zIndex=\"5000\";e.style.backgroundColor=\"#000000\";e.style.opacity=\"0.9\";e.style.display=\"flex\";e.style.justifyContent=\"center\";e.style.alignItems=\"center\";e.style.flexDirection=\"column\";const l=document.createElement(\"ul\");l.style.listStyle=\"none\";l.style.padding=\"0\";l.style.margin=\"0\";l.style.display=\"flex\";l.style.flexDirection=\"column\";l.style.justifyContent=\"center\";l.style.alignItems=\"center\";l.style.textAlign=\"center\";l.style.fontSize=\"2rem\";l.style.color=\"#fff\";l.style.textTransform=\"uppercase\";l.style.letterSpacing=\"0.2rem\";l.style.textShadow=\"0 0 1rem #000\";const n=document.createElement(\"div\"),t=document.createElement(\"button\");t.innerHTML=`<svg width=\"42\" height=\"42\" viewBox=\"0 0 42 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M16.0475 25.9525L25.9525 16.0475M25.9525 25.9525L16.0475 16.0475M15.75 38.5H26.25C35 38.5 38.5 35 38.5 26.25V15.75C38.5 7 35 3.5 26.25 3.5H15.75C7 3.5 3.5 7 3.5 15.75V26.25C3.5 35 7 38.5 15.75 38.5Z\" stroke=\"#0EC0DD\" stroke-opacity=\"0.9\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n`;t.style.position=\"absolute\";t.style.top=\"0\";t.style.right=\"0\";t.style.zIndex=\"5001\";t.style.backgroundColor=\"transparent\";t.style.border=\"none\";t.style.outline=\"none\";t.style.cursor=\"pointer\";t.style.padding=\"1rem\";t.style.margin=\"1rem\";t.style.display=\"none\";n.appendChild(t);n.classList.add(\"overlay\");n.style.display=\"none\";n.style.backgroundColor=\"#000000\";n.style.position=\"fixed\";n.style.top=\"0\";n.style.left=\"0\";n.style.width=\"100%\";n.style.height=\"100%\";n.style.zIndex=\"5000\";n.style.opacity=\"0.9\";document.body.appendChild(n);n.appendChild(e);e.appendChild(l);y.map(o=>{const s=document.createElement(\"li\");s.style.margin=\"1rem 0\",s.innerHTML=`<a href=\"${o.link}\" class=\"menu-item\">${o.name}</a>`,l.appendChild(s)});i.addEventListener(\"click\",()=>{console.log(\"first\"),n.style.display=\"block\",e.appendChild(l),t.style.display=\"block\"});t.addEventListener(\"click\",()=>{n.style.display=\"none\",t.style.display=\"none\"});\n"}],"routeData":{"route":"/about","type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true,"contentDir":"file:///Users/raphaelamponsah/Projects/winds/src/content/"},"pageMap":null,"propagation":[],"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"_@astrojs-ssr-virtual-entry.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.d16a24b9.js","@astrojs/react/client.js":"_astro/client.97e10384.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/bradley-jasper-ybanez-a1xlQq3HoJ0-unsplash.cf27ed95.jpg","/_astro/about.7ec3d693.css","/_astro/index.1d321ddf.css","/_astro/services.4cb35308.css","/_astro/about.69173a35.css","/favicon.svg","/_astro/client.97e10384.js","/images/amanz-E2IJDsYvfZI-unsplash.jpg","/images/andreas-forsberg-R_GN1I76XjM-unsplash.jpg","/images/bradley-jasper-ybanez-a1xlQq3HoJ0-unsplash.jpg","/images/daniele-franchi-cLxX7ssQfp8-unsplash.jpg","/images/faris-mohammed-d30sszrW7Vw-unsplash.jpg","/images/jesse-echevarria-FKs9bUFekHQ-unsplash.jpg","/images/milad-fakurian-58Z17lnVS4U-unsplash.jpg","/images/milad-fakurian-UYgrVfIhBec-unsplash.jpg","/images/radowan-nakif-rehan-cYyqhdbJ9TI-unsplash.jpg","/images/sam-moghadam-khamseh-KJ241ZAOYwU-unsplash.jpg","/images/sam-moghadam-khamseh-VwHzE0aFQfY-unsplash.jpg","/images/sam-moghadam-khamseh-baII27W6z7k-unsplash.jpg","/images/simone-hutsch-8FUD82rlJxs-unsplash.jpg","/images/team-nocoloco-OX1TXahR7Ng-unsplash.jpg","/images/thom-bradley-A6qNzfJXRGQ-unsplash.jpg","/images/tyler-lastovich-3shfnfzdFVc-unsplash.jpg","/images/tzepang-ngaa-_OerZ0dWow0-unsplash.jpg"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};
const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };

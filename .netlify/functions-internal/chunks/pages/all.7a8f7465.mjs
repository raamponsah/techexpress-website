import mime from 'mime';
import sharp$1 from 'sharp';
import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, _ as __astro_tag_component__, d as defineStyleVars, b as addAttribute, e as renderComponent, f as renderHead, g as renderSlot, s as spreadAttributes } from '../astro.b68fd94e.mjs';
import 'html-escaper';
/* empty css                           */import 'kleur/colors';
import 'node:fs/promises';
import 'node:path';
import 'node:url';
import 'http-cache-semantics';
import 'node:os';
import 'image-size';
import 'magic-string';
import 'node:stream';
/* empty css                              */import { jsx } from 'react/jsx-runtime';
/* empty css                           *//* empty css                           */
function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp", "svg"].includes(value);
}
function isOutputFormatSupportsAlpha(value) {
  return ["avif", "png", "webp"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

class SharpService extends BaseSSRService {
  async transform(inputBuffer, transform) {
    if (transform.format === "svg") {
      return {
        data: inputBuffer,
        format: transform.format
      };
    }
    const sharpImage = sharp$1(inputBuffer, { failOnError: false, pages: -1 });
    sharpImage.rotate();
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      sharpImage.resize({
        width,
        height,
        fit: transform.fit,
        position: transform.position,
        background: transform.background
      });
    }
    if (transform.format) {
      sharpImage.toFormat(transform.format, { quality: transform.quality });
      if (transform.background && !isOutputFormatSupportsAlpha(transform.format)) {
        sharpImage.flatten({ background: transform.background });
      }
    }
    const { data, info } = await sharpImage.toBuffer({ resolveWithObject: true });
    return {
      data,
      format: info.format
    };
  }
}
const service = new SharpService();
var sharp_default = service;

const sharp = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sharp_default
}, Symbol.toStringTag, { value: 'Module' }));

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src) {
  const base = basename(src);
  const index = base.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return base.substring(index);
}
function basename(src) {
  return removeQueryString(src.replace(/^.*[\\\/]/, ""));
}

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
const get = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = sharp_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await sharp_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$f = createAstro();
const $$CalendarIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$CalendarIcon;
  return renderTemplate`${maybeRenderHead($$result)}<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_3_115)">
    <path d="M5.94573 1.33334V3.28071M11.7752 1.33334V3.28071M2.66666 5.93562H15.0543M15.4186 5.55264V11.0702C15.4186 13.0176 14.3256 14.3158 11.7752 14.3158H5.94573C3.39535 14.3158 2.30232 13.0176 2.30232 11.0702V5.55264C2.30232 3.60527 3.39535 2.30703 5.94573 2.30703H11.7752C14.3256 2.30703 15.4186 3.60527 15.4186 5.55264Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M11.5529 8.92808H11.5595M11.5529 10.8754H11.5595M8.85681 8.92808H8.8641M8.85681 10.8754H8.8641M6.15996 8.92808H6.16724M6.15996 10.8754H6.16724" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </g>
    <defs>
    <clipPath id="clip0_3_115">
    <rect width="17.4884" height="15.5789" fill="white" transform="translate(0.116272 0.0350952)"></rect>
    </clipPath>
    </defs>
    </svg>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/CalendarIcon.astro");

const $$Astro$e = createAstro();
const $$RightArrowIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$RightArrowIcon;
  return renderTemplate`${maybeRenderHead($$result)}<svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2823 3.88439L15.7054 7.82457L11.2823 11.7647M3.31783 7.82457H15.5815" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/RightArrowIcon.astro");

function HintText() {
  return /* @__PURE__ */ jsx("small", {
    style: {
      color: "#dedede"
    },
    children: "Get 30mins Free consultation when you book"
  });
}
__astro_tag_component__(HintText, "@astrojs/react");

const $$Astro$d = createAstro();
const $$BookButton = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$BookButton;
  const { color, text, RightIcon, LeftIcon, p = 0, px = 0, py = 0 } = Astro2.props;
  const $$definedVars = defineStyleVars([{ p, px, py }]);
  return renderTemplate`${maybeRenderHead($$result)}<button${addAttribute([["button secondary"], "astro-FEHEDV7L"], "class:list")}${addAttribute($$definedVars, "style")}>

   ${renderComponent($$result, "CalendarIcon", $$CalendarIcon, { "class": "astro-FEHEDV7L" })}    
    <span class="astro-FEHEDV7L">${text}</span>
    ${renderComponent($$result, "RightArrowIcon", $$RightArrowIcon, { "class": "astro-FEHEDV7L" })}
    </button>

    ${renderComponent($$result, "HintText", HintText, { "class": "astro-FEHEDV7L" })}`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/BookButton.astro");

const $$Astro$c = createAstro();
const $$BookSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$BookSection;
  return renderTemplate`${maybeRenderHead($$result)}<section id="book" class="astro-7VINSZ7S">
	<h5 class="astro-7VINSZ7S">
		Feel free to book a meeting with us, 
we offer 30 mins free consultation
	</h5>
	
	${renderComponent($$result, "BookButton", $$BookButton, { "text": "Book a meeting with us", "px": "10px", "py": "10px", "class": "astro-7VINSZ7S" })}

	<a class="telephone astro-7VINSZ7S" href="phone:+233503422990"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="astro-7VINSZ7S">
		<g clip-path="url(#clip0_3_249)" class="astro-7VINSZ7S">
		<path d="M14.6467 12.22C14.6467 12.46 14.5933 12.7066 14.48 12.9466C14.3667 13.1866 14.22 13.4133 14.0267 13.6266C13.7 13.9866 13.34 14.2466 12.9333 14.4133C12.5333 14.58 12.1 14.6666 11.6333 14.6666C10.9533 14.6666 10.2267 14.5066 9.46 14.18C8.69334 13.8533 7.92667 13.4133 7.16667 12.86C6.39207 12.2934 5.66113 11.6694 4.98 10.9933C4.30585 10.3147 3.68407 9.5859 3.12 8.81331C2.57334 8.05331 2.13334 7.29331 1.81334 6.53998C1.49334 5.77998 1.33334 5.05331 1.33334 4.35998C1.33334 3.90665 1.41334 3.47331 1.57334 3.07331C1.73334 2.66665 1.98667 2.29331 2.34 1.95998C2.76667 1.53998 3.23334 1.33331 3.72667 1.33331C3.91334 1.33331 4.1 1.37331 4.26667 1.45331C4.44 1.53331 4.59334 1.65331 4.71334 1.82665L6.26 4.00665C6.38 4.17331 6.46667 4.32665 6.52667 4.47331C6.58667 4.61331 6.62 4.75331 6.62 4.87998C6.62 5.03998 6.57334 5.19998 6.48 5.35331C6.39334 5.50665 6.26667 5.66665 6.10667 5.82665L5.6 6.35331C5.52667 6.42665 5.49334 6.51331 5.49334 6.61998C5.49334 6.67331 5.5 6.71998 5.51334 6.77331C5.53334 6.82665 5.55334 6.86665 5.56667 6.90665C5.68667 7.12665 5.89334 7.41331 6.18667 7.75998C6.48667 8.10665 6.80667 8.45998 7.15334 8.81331C7.51334 9.16665 7.86 9.49331 8.21334 9.79331C8.56 10.0866 8.84667 10.2866 9.07334 10.4066C9.10667 10.42 9.14667 10.44 9.19334 10.46C9.24667 10.48 9.3 10.4866 9.36 10.4866C9.47334 10.4866 9.56 10.4466 9.63334 10.3733L10.14 9.87331C10.3067 9.70665 10.4667 9.57998 10.62 9.49998C10.7733 9.40665 10.9267 9.35998 11.0933 9.35998C11.22 9.35998 11.3533 9.38665 11.5 9.44665C11.6467 9.50665 11.8 9.59331 11.9667 9.70665L14.1733 11.2733C14.3467 11.3933 14.4667 11.5333 14.54 11.7C14.6067 11.8666 14.6467 12.0333 14.6467 12.22Z" stroke="black" stroke-opacity="0.3" stroke-width="1.5" stroke-miterlimit="10" class="astro-7VINSZ7S"></path>
		</g>
		<defs class="astro-7VINSZ7S">
		<clipPath id="clip0_3_249" class="astro-7VINSZ7S">
		<rect width="16" height="16" fill="white" class="astro-7VINSZ7S"></rect>
		</clipPath>
		</defs>
		</svg>
		+233503422990</a>
</section>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/BookSection.astro");

const $$Astro$b = createAstro();
const $$Callout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Callout;
  return renderTemplate`${maybeRenderHead($$result)}<section class="callout astro-MRMIM4EF">
    <p class="astro-MRMIM4EF">
        We are a software company
that build apps to scale 
with your business
    </p>
</section>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/Callout.astro");

const $$Astro$a = createAstro();
const $$CircleWithText = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$CircleWithText;
  const { label, image } = Astro2.props;
  const $$definedVars = defineStyleVars([{ image }]);
  return renderTemplate`${maybeRenderHead($$result)}<div class="circle-with-text astro-37KXKGDC"${addAttribute($$definedVars, "style")}>
    <div class="circle astro-37KXKGDC"></div>
<h5 class="astro-37KXKGDC">${label}</h5>
</div>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/CircleWithText.astro");

const $$Astro$9 = createAstro();
const $$CircularComponents = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$CircularComponents;
  const { heading } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<section id="circular-components" class="dark-background astro-C6KWLYQP">
    <h3 class="astro-C6KWLYQP">${heading}</h3>
    <div class="circles-set astro-C6KWLYQP">
     ${renderComponent($$result, "CircleWithText", $$CircleWithText, { "image": "url(/images/sam-moghadam-khamseh-baII27W6z7k-unsplash.jpg)", "label": "Quality", "class": "astro-C6KWLYQP" })}
     ${renderComponent($$result, "CircleWithText", $$CircleWithText, { "image": "url(/images/milad-fakurian-58Z17lnVS4U-unsplash.jpg)", "label": "Innovation", "class": "astro-C6KWLYQP" })}
     ${renderComponent($$result, "CircleWithText", $$CircleWithText, { "image": "url(/images/daniele-franchi-cLxX7ssQfp8-unsplash.jpg)", "label": "Integrity", "class": "astro-C6KWLYQP" })}
        
    </div>
</section>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/CircularComponents.astro");

const $$Astro$8 = createAstro();
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer>
    <h6>techexpress.dev | Terms & Conditions Apply</h6>
</footer>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/Footer.astro");

const $$Astro$7 = createAstro();
const $$ResponsiveMenuBtn = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$ResponsiveMenuBtn;
  return renderTemplate`${maybeRenderHead($$result)}<button id="hamburger-menu" class="astro-3ZGT4HB2">
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" class="astro-3ZGT4HB2">
        <path d="M5.25 12.25H36.75M5.25 21H36.75M5.25 29.75H36.75" stroke="#0EC0DD" stroke-width="1.5" stroke-linecap="round" class="astro-3ZGT4HB2"></path>
        </svg>
        
</button>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/ResponsiveMenuBtn.astro");

const $$Astro$6 = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Header;
  const { mainTitle, specialTitle, tagline, image } = Astro2.props;
  const $$definedVars = defineStyleVars([{ image }]);
  return renderTemplate`${maybeRenderHead($$result)}<header class="astro-3EF6KSR2"${addAttribute($$definedVars, "style")}>
    <div class="top-bar astro-3EF6KSR2">
        <svg width="35" height="30" viewBox="0 0 35 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="astro-3EF6KSR2">
            <path d="M19.378 21.23C19.378 22.77 19.014 24.156 18.286 25.388C17.586 26.62 16.508 27.6 15.052 28.328C13.596 29.056 11.748 29.42 9.508 29.42C7.296 29.42 5.504 29.084 4.132 28.412C2.76 27.712 1.752 26.802 1.108 25.682C0.464 24.562 0.142 23.316 0.142 21.944C0.142 20.572 0.464 19.312 1.108 18.164C1.752 16.988 2.816 15.91 4.3 14.93C3.124 14.146 2.214 13.18 1.57 12.032C0.954 10.884 0.646 9.54 0.646 8C0.646 6.516 0.996 5.172 1.696 3.968C2.396 2.764 3.418 1.812 4.762 1.112C6.106 0.383998 7.716 0.0199976 9.592 0.0199976C11.608 0.0199976 13.302 0.355998 14.674 1.028C16.046 1.7 17.068 2.61 17.74 3.758C18.44 4.878 18.79 6.138 18.79 7.538C18.79 8.77 18.496 9.932 17.908 11.024C17.348 12.088 16.396 13.082 15.052 14.006C17.936 15.63 19.378 18.038 19.378 21.23ZM9.214 11.864L11.272 12.494C12.224 11.682 12.882 10.94 13.246 10.268C13.638 9.568 13.834 8.854 13.834 8.126C13.834 7.006 13.47 6.124 12.742 5.48C12.042 4.808 11.034 4.472 9.718 4.472C8.402 4.472 7.38 4.794 6.652 5.438C5.952 6.082 5.602 6.964 5.602 8.084C5.602 9.848 6.806 11.108 9.214 11.864ZM5.098 21.23C5.098 22.35 5.504 23.26 6.316 23.96C7.128 24.632 8.276 24.968 9.76 24.968C11.216 24.968 12.35 24.632 13.162 23.96C14.002 23.288 14.422 22.392 14.422 21.272C14.422 20.432 14.114 19.676 13.498 19.004C12.91 18.304 11.888 17.73 10.432 17.282L8.164 16.568C7.128 17.408 6.358 18.192 5.854 18.92C5.35 19.648 5.098 20.418 5.098 21.23ZM15.58 29V0.44H24.274C26.402 0.44 28.082 0.747999 29.314 1.364C30.574 1.98 31.47 2.848 32.002 3.968C32.562 5.088 32.842 6.404 32.842 7.916V9.092C32.842 11.304 31.89 12.998 29.986 14.174C31.33 14.706 32.352 15.476 33.052 16.484C33.752 17.492 34.102 18.696 34.102 20.096V21.272C34.102 22.812 33.822 24.17 33.262 25.346C32.702 26.494 31.778 27.39 30.49 28.034C29.202 28.678 27.48 29 25.324 29H15.58ZM24.274 5.06H20.62V12.2H24.274C25.394 12.2 26.234 11.948 26.794 11.444C27.382 10.912 27.676 10.198 27.676 9.302V7.916C27.676 7.02 27.382 6.32 26.794 5.816C26.234 5.312 25.394 5.06 24.274 5.06ZM25.324 16.82H20.62V24.38H25.324C26.5 24.38 27.396 24.1 28.012 23.54C28.628 22.98 28.936 22.224 28.936 21.272V19.886C28.936 18.934 28.628 18.192 28.012 17.66C27.396 17.1 26.5 16.82 25.324 16.82Z" fill="white" class="astro-3EF6KSR2"></path>
            </svg>
            
            
  ${renderComponent($$result, "ResponsiveMenuBtn", $$ResponsiveMenuBtn, { "class": "astro-3EF6KSR2" })}
    </div>

    <div class="header-message astro-3EF6KSR2">
        <h3 class="astro-3EF6KSR2">${mainTitle}<span class="bold astro-3EF6KSR2">${specialTitle}</span></h3>

        <h5 class="astro-3EF6KSR2">${tagline}</h5>
        ${renderComponent($$result, "BookButton", $$BookButton, { "text": "Book a meeting with us", "py": "10px", "px": "10px", "class": "astro-3EF6KSR2" })}
    </div>


</header>`;
}, "/Users/raphaelamponsah/Projects/winds/src/components/Header.astro");

const $$Astro$5 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width">
		<link rel="icon" type="image/svg+xml" href="/favicon.svg">
		<meta name="generator"${addAttribute(Astro2.generator, "content")}>
		<title>${title}</title>



	${renderHead($$result)}</head>
	<body>
		${renderSlot($$result, $$slots["default"])}
	</body></html>`;
}, "/Users/raphaelamponsah/Projects/winds/src/layouts/Layout.astro");

const $$Astro$4 = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to TechExpress.", "class": "astro-J7PV25F6" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<main class="astro-J7PV25F6">
	
	${renderComponent($$result2, "Header", $$Header, { "image": "url(/images/sam-moghadam-khamseh-KJ241ZAOYwU-unsplash.jpg)", "mainTitle": "Welcome to Tech", "specialTitle": "Express", "tagline": "We build web/mobile apps that scale at affordable pricing", "class": "astro-J7PV25F6" })}

		${renderComponent($$result2, "Callout", $$Callout, { "class": "astro-J7PV25F6" })}

		<section id="about" class="astro-J7PV25F6">
			<div class="overlay astro-J7PV25F6"></div>
			<div class="content astro-J7PV25F6">
				<h3 class="bold astro-J7PV25F6">About</h3>
			<p class="bold astro-J7PV25F6">
				We are an innovative software company, based in Accra, Ghana. 
				We build software that scale with your business processes. 
			</p>
			

			</div>
			<div class="section-footer astro-J7PV25F6">
				<a href="/about" class="astro-J7PV25F6">
					<svg width="50" height="38" viewBox="0 0 50 38" fill="none" xmlns="http://www.w3.org/2000/svg" class="astro-J7PV25F6">
						<rect width="50" height="39" fill="black" class="astro-J7PV25F6"></rect>
						<path d="M30.43 12.93L36.5 19L30.43 25.07M19.5 19H36.33" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" class="astro-J7PV25F6"></path>
						</svg>
						
					</a>
			</div>
		</section>


		<section id="index-services" class="astro-J7PV25F6">
			<div class="section-image astro-J7PV25F6">
				<img${addAttribute(200, "width")}${addAttribute(200, "height")} alt="services-abstract-image"${addAttribute("/images/jesse-echevarria-FKs9bUFekHQ-unsplash.jpg", "src")} class="astro-J7PV25F6">
				
			</div>
			<div class="content light astro-J7PV25F6">
				<h3 class="astro-J7PV25F6">What we do</h3>
				<p class="astro-J7PV25F6">
					Our sole aim is to provide you with quality applications for your business. 
We use modern day cutting-edge technologies to design, develop and deploy your software.
				</p>
			</div>
		
			<div class="section-footer astro-J7PV25F6">
				<a href="/services" class="astro-J7PV25F6">
					<svg width="50" height="39" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg" class="astro-J7PV25F6">
						<rect width="50" height="39" fill="#0EC0DD" fill-opacity="0.9" class="astro-J7PV25F6"></rect>
						<path d="M27.43 13.93L33.5 20L27.43 26.07M16.5 20H33.33" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" class="astro-J7PV25F6"></path>
						</svg>
						
					</a>
			</div>
		</section>

		<div class=" astro-J7PV25F6">
			${renderComponent($$result2, "CircularComponents", $$CircularComponents, { "heading": "Core Values", "class": "astro-J7PV25F6" })}
		</div>

	

${renderComponent($$result2, "BookSection", $$BookSection, { "class": "astro-J7PV25F6" })}

	</main>${renderComponent($$result2, "Footer", $$Footer, { "class": "astro-J7PV25F6" })}` })}`;
}, "/Users/raphaelamponsah/Projects/winds/src/pages/index.astro");

const $$file$2 = "/Users/raphaelamponsah/Projects/winds/src/pages/index.astro";
const $$url$2 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => sharp).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":undefined},{_:process.env._,SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? globalThis.astroImage.defaultLoader : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : globalThis.astroImage.defaultLoader.serializeTransform(resolved);
  const imgSrc = !isLocalImage && resolved.src.startsWith("//") ? `https:${resolved.src}` : resolved.src;
  let src;
  if (/^[\/\\]?@astroimage/.test(imgSrc)) {
    src = `${imgSrc}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", imgSrc);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, alt, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required. ex: `widths={[100]}`");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  const allFormats = await resolveFormats(params);
  const lastFormat = allFormats[allFormats.length - 1];
  const maxWidth = Math.max(...widths);
  let image;
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          alt,
          format,
          width,
          fit,
          position,
          background,
          aspectRatio
        });
        if (format === lastFormat && width === maxWidth) {
          image = img;
        }
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    image
  };
}

const $$Astro$3 = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Image;
  const { loading = "lazy", decoding = "async", ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    warnForMissingAlt();
  }
  const attrs = await getImage(props);
  return renderTemplate`${maybeRenderHead($$result)}<img${spreadAttributes(attrs)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}>`;
}, "/Users/raphaelamponsah/Projects/winds/node_modules/@astrojs/image/components/Image.astro");

const $$Astro$2 = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio,
    fit,
    background,
    position,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    ...attrs
  } = Astro2.props;
  if (alt === void 0 || alt === null) {
    warnForMissingAlt();
  }
  const { image, sources } = await getPicture({
    src,
    widths,
    formats,
    aspectRatio,
    fit,
    background,
    position,
    alt
  });
  delete image.width;
  delete image.height;
  return renderTemplate`${maybeRenderHead($$result)}<picture>
	${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2)}${addAttribute(sizes, "sizes")}>`)}
	<img${spreadAttributes(image)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${spreadAttributes(attrs)}>
</picture>`;
}, "/Users/raphaelamponsah/Projects/winds/node_modules/@astrojs/image/components/Picture.astro");

let altWarningShown = false;
function warnForMissingAlt() {
  if (altWarningShown === true) {
    return;
  }
  altWarningShown = true;
  console.warn(`
[@astrojs/image] "alt" text was not provided for an <Image> or <Picture> component.

A future release of @astrojs/image may throw a build error when "alt" text is missing.

The "alt" attribute holds a text description of the image, which isn't mandatory but is incredibly useful for accessibility. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel).
`);
}

const $$Astro$1 = createAstro();
const $$Services = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Services;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to 8Bytes.", "class": "astro-UCD2PS2B" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<main class="astro-UCD2PS2B">
	
	${renderComponent($$result2, "Header", $$Header, { "image": "url(/images/milad-fakurian-UYgrVfIhBec-unsplash.jpg)", "mainTitle": "Welcome to 8Bytes", "specialTitle": "", "tagline": "We build web/mobile apps that scale at affordable pricing", "class": "astro-UCD2PS2B" })}

		${renderComponent($$result2, "Callout", $$Callout, { "class": "astro-UCD2PS2B" })}

		<section id="services" class="astro-UCD2PS2B">
	
			<div class="content astro-UCD2PS2B">
				<h3 class="bold astro-UCD2PS2B">What we do</h3>
			<p class="astro-UCD2PS2B">
				Our goal is to provide your business with the highest quality software applications available. We utilize the most cutting-edge technologies to design, develop, and deploy your software, so you can rest assured that your applications are reliable, efficient, and secure.
			</p>

            <!-- <p class="big-text">
                We understand the importance of meeting your business goals and objectives, and our team of experienced professionals is dedicated to providing you with the best quality applications that will meet and exceed your expectations.
            </p> -->

			</div>

		</section>


        <h4 class="astro-UCD2PS2B">Services</h4>
		<section class="section astro-UCD2PS2B">
			<div class="section-image astro-UCD2PS2B">
				${renderComponent($$result2, "Image", $$Image, { "width": 150, "height": 220, "alt": "services-abstract-image", "src": "/images/radowan-nakif-rehan-cYyqhdbJ9TI-unsplash.jpg", "class": "astro-UCD2PS2B" })}
				
			</div>
			<div class="content light astro-UCD2PS2B">
				<h3 class="astro-UCD2PS2B">Software Development</h3>
				<p class="astro-UCD2PS2B">
					Our sole aim is to provide you with quality applications for your business. 
We use modern day cutting-edge technologies to design, develop and deploy your software.
				</p>
			</div>
		</section>

        <section class="section astro-UCD2PS2B">
			<div class="section-image astro-UCD2PS2B">
				${renderComponent($$result2, "Image", $$Image, { "width": 150, "height": 220, "alt": "services-abstract-image", "src": "/images/thom-bradley-A6qNzfJXRGQ-unsplash.jpg", "class": "astro-UCD2PS2B" })}
				
			</div>
			<div class="content light astro-UCD2PS2B">
				<h3 class="astro-UCD2PS2B">Mobile App Development</h3>
				<p class="astro-UCD2PS2B">
					Our sole aim is to provide you with quality applications for your business. 
We use modern day cutting-edge technologies to design, develop and deploy your software.
				</p>
			</div>
		</section>

		${renderComponent($$result2, "CircularComponents", $$CircularComponents, { "heading": "Core Values", "class": "astro-UCD2PS2B" })}
		${renderComponent($$result2, "BookSection", $$BookSection, { "class": "astro-UCD2PS2B" })}

	</main>${renderComponent($$result2, "Footer", $$Footer, { "class": "astro-UCD2PS2B" })}` })}`;
}, "/Users/raphaelamponsah/Projects/winds/src/pages/services.astro");

const $$file$1 = "/Users/raphaelamponsah/Projects/winds/src/pages/services.astro";
const $$url$1 = "/services";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Services,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro();
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to TechExpress.", "class": "astro-KH7BTL4R" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<main class="astro-KH7BTL4R">
	
	${renderComponent($$result2, "Header", $$Header, { "image": "url(/images/tyler-lastovich-3shfnfzdFVc-unsplash.jpg)", "mainTitle": "We are a Software Company", "specialTitle": "", "tagline": "We express your business processes through quality software", "class": "astro-KH7BTL4R" })}

		${renderComponent($$result2, "Callout", $$Callout, { "class": "astro-KH7BTL4R" })}

		<section id="who-we-are" class="astro-KH7BTL4R">
            <div class="section-image astro-KH7BTL4R">
                ${renderComponent($$result2, "Image", $$Image, { "width": 200, "height": 382, "alt": "services-abstract-image", "src": "/images/andreas-forsberg-R_GN1I76XjM-unsplash.jpg", "class": "astro-KH7BTL4R" })}
            </div>
            <div class="content astro-KH7BTL4R">
                <h3 class="astro-KH7BTL4R">Who we are</h3>
                <p class="astro-KH7BTL4R">
                    At 8bytes in Accra, we are a team of software experts dedicated to building custom web and mobile applications that transform your business. Our agile approach and cutting-edge technology ensure your success, every time. Choose 8bytes and experience the difference.
                </p>
            </div>
		</section>


		
		    ${renderComponent($$result2, "CircularComponents", $$CircularComponents, { "heading": "Core Values", "class": "astro-KH7BTL4R" })}
	

        <section id="about-detail" class="astro-KH7BTL4R">
			<p class="astro-KH7BTL4R">
				We are more than just a software company - we are your partner in innovation. Our team of experienced developers, project managers, and designers work closely with you to understand your unique needs and deliver tailored solutions that meet your objectives.</p> 
                
            <p style="margin-top:10px" class="astro-KH7BTL4R"> At 8bytes, we specialize in mobile app development, web app development, and desktop development. We use modern technologies and agile methodologies to ensure high-quality and timely delivery, every time. Let us help you take your business to the next level with our expert services.

            </p>
		</section>

${renderComponent($$result2, "BookSection", $$BookSection, { "class": "astro-KH7BTL4R" })}

	</main>${renderComponent($$result2, "Footer", $$Footer, { "class": "astro-KH7BTL4R" })}` })}`;
}, "/Users/raphaelamponsah/Projects/winds/src/pages/about.astro");

const $$file = "/Users/raphaelamponsah/Projects/winds/src/pages/about.astro";
const $$url = "/about";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c };

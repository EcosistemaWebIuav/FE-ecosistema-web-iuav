module.exports = {
	config: {
		tailwindjs: "./tailwind.config.js",
		port: 9050
	},
	paths: {
		root: "./",
		src: {
			base: "./src",
			css: "./src/assets/css",
			js: "./src/assets/js",
			img: "./src/assets/img",
			fonts: "./src/assets/fonts"
		},
		build: {
			base: "./build",
			css: "./build/assets/css",
			js: "./build/assets/js",
			img: "./build/assets/img",
			fonts: "./build/assets/fonts"
		},
		dist: {
			base: "./dist",
			css: "./dist/assets/css",
			js: "./dist/assets/js",
			img: "./dist/assets/img",
			fonts: "./dist/assets/fonts"
		},
		plugins: "/assets/js/vendor"
	}
}

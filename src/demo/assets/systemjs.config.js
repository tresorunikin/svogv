﻿/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({        
        paths: {
            // paths serve as alias
            'npm:': '/assets/js/lib/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: '/app',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            '@svogv/forms': 'npm:@svogv/svogv-forms.umd.js',
            '@svogv/blocks': 'npm:@svogv/svogv-blocks.umd.js',
            '@svogv/maps': 'npm:@svogv/svogv-maps.umd.js',
            '@svogv/hud': 'npm:@svogv/svogv-hud.umd.js'
        },        
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            'app': {
                main: './app.js',
                defaultExtension: 'js'
            }
        },
        bundles: {
            '/assets/js/lib/rxjs/bundles/rx.min.js': [
            "rxjs/*",
            "rxjs/rx/*",
            "rxjs/symbol/*",
            "rxjs/operator/*",
            "rxjs/observable/*",
            "rxjs/add/operator/*",
            "rxjs/add/observable/*",
            "rxjs/util/*"
        ]
        }
    });
})(this);
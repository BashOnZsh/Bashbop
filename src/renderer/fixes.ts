/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { localStorage } from "./utils";

const originalFetch = window.fetch.bind(window) as typeof fetch;
window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);

    try {
        const requestUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        const isBashcordReleasesApi =
            requestUrl.includes("api.github.com/repos/BashOnZsh/Bashcord/releases") ||
            requestUrl.includes("api.github.com/repos/BashOnZsh/Bashcord/releases/");

        if (!isBashcordReleasesApi) return response;

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return response;

        const releaseData = await response.clone().json();
        if (!Array.isArray(releaseData)) return response;

        let changed = false;
        for (const release of releaseData) {
            const assets = release?.assets;
            if (!Array.isArray(assets)) continue;

            const hasLegacyName = assets.some(asset => asset?.name === "equibop.asar");
            const renamedAsset = assets.find(asset => asset?.name === "bashbop.asar");

            if (!hasLegacyName && renamedAsset) {
                assets.push({ ...renamedAsset, name: "equibop.asar" });
                changed = true;
            }
        }

        if (!changed) return response;

        return new Response(JSON.stringify(releaseData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
    } catch {
        return response;
    }
}) as typeof fetch;

const NOISY_LOG_PATTERNS = [
    "was preloaded using link preload but not used within a few seconds from the window's load event",
    "No release asset named equibop.asar found in latest release",
    "AnalyticsTrackImpressionContext function unimplemented"
];

function containsNoisyMessage(value: unknown): boolean {
    if (typeof value === "string") {
        return NOISY_LOG_PATTERNS.some(pattern => value.includes(pattern));
    }

    if (value && typeof value === "object") {
        if ("message" in value && typeof (value as { message?: unknown }).message === "string") {
            return containsNoisyMessage((value as { message: string }).message);
        }

        for (const nested of Object.values(value as Record<string, unknown>)) {
            if (containsNoisyMessage(nested)) return true;
        }
    }

    return false;
}

function shouldSuppressLog(args: unknown[]): boolean {
    return args.some(containsNoisyMessage);
}

const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
    if (shouldSuppressLog(args)) return;
    originalConsoleWarn(...args);
};

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
    if (shouldSuppressLog(args)) return;
    originalConsoleError(...args);
};

// Make clicking Notifications focus the window
const originalSetOnClick = Object.getOwnPropertyDescriptor(Notification.prototype, "onclick")!.set!;
Object.defineProperty(Notification.prototype, "onclick", {
    set(onClick) {
        originalSetOnClick.call(this, function (this: unknown) {
            onClick.apply(this, arguments);
            VesktopNative.win.focus();
        });
    },
    configurable: true
});

// Hide "Download Discord Desktop now!!!!" banner
localStorage.setItem("hideNag", "true");

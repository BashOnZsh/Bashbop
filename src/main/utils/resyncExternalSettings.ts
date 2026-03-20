/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2026 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { app } from "electron";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

import { DATA_DIR } from "../constants";

const TARGET_SETTINGS_DIR = join(DATA_DIR, "settings");

function copyDirectoryRecursive(sourceDir: string, targetDir: string) {
    mkdirSync(targetDir, { recursive: true });

    for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
        const sourcePath = join(sourceDir, entry.name);
        const targetPath = join(targetDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectoryRecursive(sourcePath, targetPath);
            continue;
        }

        if (entry.isFile()) {
            copyFileSync(sourcePath, targetPath);
        }
    }
}

export async function resyncExternalSettingsOnStartup() {
    const appDataDir = app.getPath("appData");
    const sourceCandidates = [
        join(appDataDir, "Equicord", "settings"),
        join(appDataDir, "Vencord", "settings")
    ];

    const sourceDir = sourceCandidates.find(existsSync);
    if (!sourceDir) return;

    try {
        copyDirectoryRecursive(sourceDir, TARGET_SETTINGS_DIR);
        console.log(`[Settings Sync] Imported settings from: ${sourceDir}`);
    } catch (error) {
        console.error("[Settings Sync] Failed to sync external settings:", error);
    }
}

// ============================================================
// VAULTLINE 3D — Character Models
// Detailed 3D character models built from geometry
// ============================================================

import * as THREE from 'three';

// --- Material Library ---
const MATS = {
    skin: () => new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.7, metalness: 0.0 }),
    skinDark: () => new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.7, metalness: 0.0 }),
    tactical: () => new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.6, metalness: 0.2 }),
    tacticalDark: () => new THREE.MeshStandardMaterial({ color: 0x151520, roughness: 0.7, metalness: 0.1 }),
    armor: () => new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.4, metalness: 0.6 }),
    armorHeavy: () => new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.3, metalness: 0.7 }),
    metal: () => new THREE.MeshStandardMaterial({ color: 0x667788, roughness: 0.3, metalness: 0.8 }),
    metalDark: () => new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.4, metalness: 0.7 }),
    visorGreen: () => new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.3 }),
    visorRed: () => new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.3 }),
    visorOrange: () => new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.3 }),
    visorCyan: () => new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.3 }),
    neonCyan: () => new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.4 }),
    neonMagenta: () => new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.4 }),
    neonOrange: () => new THREE.MeshStandardMaterial({ color: 0xff6b35, emissive: 0xff6b35, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.4 }),
    black: () => new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.8, metalness: 0.1 }),
    glass: () => new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.4 }),
    fabric: () => new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.9, metalness: 0.0 }),
    leather: () => new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.7, metalness: 0.0 }),
    gold: () => new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xffdd00, emissiveIntensity: 0.3, roughness: 0.2, metalness: 0.8 }),
    red: () => new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.5, metalness: 0.2 }),
    green: () => new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.5, metalness: 0.2 }),
};

// ============================================================
// OPERATOR (Player character)
// ============================================================
export function createOperator(options = {}) {
    const {
        armorLevel = 0,    // 0=none, 1=light, 2=tactical, 3=heavy
        weaponType = 'pistol',
        hasCyberware = false,
        skinTone = 0,
        helmet = true,
    } = options;

    const group = new THREE.Group();
    const skinMat = skinTone === 0 ? MATS.skin() : MATS.skinDark();

    // === BODY ===
    // Torso
    const torsoGeo = armorLevel >= 2
        ? new THREE.BoxGeometry(0.7, 0.8, 0.45)
        : new THREE.BoxGeometry(0.6, 0.75, 0.4);
    const torsoMat = armorLevel >= 1 ? MATS.armor() : MATS.tactical();
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.1;
    torso.castShadow = true;
    group.add(torso);

    // Chest plate (tactical+)
    if (armorLevel >= 2) {
        const plateGeo = new THREE.BoxGeometry(0.55, 0.35, 0.1);
        const plate = new THREE.Mesh(plateGeo, MATS.armorHeavy());
        plate.position.set(0, 1.25, 0.25);
        group.add(plate);
    }

    // Shoulder pads
    if (armorLevel >= 1) {
        for (const side of [-1, 1]) {
            const padGeo = new THREE.SphereGeometry(0.18, 8, 6);
            const pad = new THREE.Mesh(padGeo, MATS.armor());
            pad.position.set(side * 0.42, 1.35, 0);
            pad.scale.set(1, 0.7, 0.8);
            group.add(pad);
        }
    }

    // Belt
    const beltGeo = new THREE.BoxGeometry(0.65, 0.08, 0.42);
    const belt = new THREE.Mesh(beltGeo, MATS.metalDark());
    belt.position.y = 0.7;
    group.add(belt);

    // Belt pouches
    for (let i = 0; i < 3; i++) {
        const pouchGeo = new THREE.BoxGeometry(0.1, 0.08, 0.08);
        const pouch = new THREE.Mesh(pouchGeo, MATS.tacticalDark());
        pouch.position.set(-0.2 + i * 0.2, 0.65, 0.2);
        group.add(pouch);
    }

    // === ARMS ===
    for (const side of [-1, 1]) {
        // Upper arm
        const upperArmGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.45, 8);
        const upperArm = new THREE.Mesh(upperArmGeo, armorLevel >= 2 ? MATS.armor() : skinMat);
        upperArm.position.set(side * 0.4, 1.1, 0);
        upperArm.castShadow = true;
        group.add(upperArm);

        // Forearm
        const forearmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.4, 8);
        const forearm = new THREE.Mesh(forearmGeo, armorLevel >= 1 ? MATS.armor() : skinMat);
        forearm.position.set(side * 0.4, 0.65, 0);
        forearm.castShadow = true;
        group.add(forearm);

        // Glove/hand
        const handGeo = new THREE.BoxGeometry(0.1, 0.12, 0.08);
        const hand = new THREE.Mesh(handGeo, MATS.black());
        hand.position.set(side * 0.4, 0.4, 0);
        group.add(hand);

        // Arm cyberware glow
        if (hasCyberware && side === 1) {
            const glowGeo = new THREE.BoxGeometry(0.06, 0.2, 0.06);
            const glow = new THREE.Mesh(glowGeo, MATS.neonCyan());
            glow.position.set(side * 0.4, 0.9, 0.1);
            group.add(glow);
        }
    }

    // === LEGS ===
    for (const side of [-1, 1]) {
        // Thigh
        const thighGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 8);
        const thigh = new THREE.Mesh(thighGeo, MATS.tacticalDark());
        thigh.position.set(side * 0.15, 0.45, 0);
        thigh.castShadow = true;
        group.add(thigh);

        // Shin
        const shinGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.45, 8);
        const shin = new THREE.Mesh(shinGeo, armorLevel >= 2 ? MATS.armor() : MATS.tacticalDark());
        shin.position.set(side * 0.15, 0.0, 0);
        shin.castShadow = true;
        group.add(shin);

        // Boot
        const bootGeo = new THREE.BoxGeometry(0.14, 0.1, 0.22);
        const boot = new THREE.Mesh(bootGeo, MATS.black());
        boot.position.set(side * 0.15, -0.05, 0.03);
        group.add(boot);
    }

    // === HEAD ===
    if (helmet) {
        // Helmet shell
        const helmetGeo = new THREE.SphereGeometry(0.22, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.7);
        const helmetMesh = new THREE.Mesh(helmetGeo, MATS.armor());
        helmetMesh.position.y = 1.55;
        helmetMesh.castShadow = true;
        group.add(helmetMesh);

        // Helmet top ridge
        const ridgeGeo = new THREE.BoxGeometry(0.06, 0.08, 0.3);
        const ridge = new THREE.Mesh(ridgeGeo, MATS.metal());
        ridge.position.set(0, 1.72, 0);
        group.add(ridge);

        // Visor
        const visorGeo = new THREE.BoxGeometry(0.38, 0.1, 0.08);
        const visor = new THREE.Mesh(visorGeo, MATS.visorCyan());
        visor.position.set(0, 1.55, 0.15);
        group.add(visor);

        // Ear pieces
        for (const side of [-1, 1]) {
            const earGeo = new THREE.BoxGeometry(0.06, 0.12, 0.15);
            const ear = new THREE.Mesh(earGeo, MATS.metal());
            ear.position.set(side * 0.22, 1.55, 0);
            group.add(ear);
        }

        // Chin guard
        const chinGeo = new THREE.BoxGeometry(0.3, 0.08, 0.1);
        const chin = new THREE.Mesh(chinGeo, MATS.armor());
        chin.position.set(0, 1.4, 0.12);
        group.add(chin);
    } else {
        // Bare head
        const headGeo = new THREE.SphereGeometry(0.18, 10, 8);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.y = 1.55;
        head.castShadow = true;
        group.add(head);

        // Eyes
        for (const side of [-1, 1]) {
            const eyeGeo = new THREE.SphereGeometry(0.03, 6, 6);
            const eye = new THREE.Mesh(eyeGeo, MATS.visorCyan());
            eye.position.set(side * 0.07, 1.57, 0.15);
            group.add(eye);
        }
    }

    // === WEAPON (on back or hip) ===
    if (weaponType === 'rifle') {
        const gunGroup = createRifle();
        gunGroup.position.set(0.25, 1.0, -0.3);
        gunGroup.rotation.y = Math.PI;
        group.add(gunGroup);
    } else if (weaponType === 'shotgun') {
        const gunGroup = createShotgun();
        gunGroup.position.set(0.2, 0.9, -0.25);
        gunGroup.rotation.y = Math.PI;
        group.add(gunGroup);
    }

    // === BACKPACK (cyberware) ===
    if (hasCyberware) {
        const bpGeo = new THREE.BoxGeometry(0.35, 0.4, 0.2);
        const bp = new THREE.Mesh(bpGeo, MATS.metalDark());
        bp.position.set(0, 1.1, -0.3);
        group.add(bp);

        // Status lights on backpack
        for (let i = 0; i < 3; i++) {
            const lightGeo = new THREE.SphereGeometry(0.02, 4, 4);
            const light = new THREE.Mesh(lightGeo, i === 0 ? MATS.neonGreen() : MATS.neonCyan());
            light.position.set(-0.1 + i * 0.1, 1.25, -0.41);
            group.add(light);
        }
    }

    return group;
}

// ============================================================
// GUARD (Standard enemy)
// ============================================================
export function createGuard(type = 'standard') {
    const group = new THREE.Group();

    const colors = {
        standard: { suit: 0x2a2a3a, accent: 0x444466, visor: 0x00ff00 },
        elite: { suit: 0x1a1a2a, accent: 0x663300, visor: 0xff6600 },
        commander: { suit: 0x2a1a1a, accent: 0x880000, visor: 0xff0000 },
    };
    const c = colors[type] || colors.standard;

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.6, 0.8, 0.35);
    const bodyMat = new THREE.MeshStandardMaterial({ color: c.suit, roughness: 0.6, metalness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.1;
    body.castShadow = true;
    group.add(body);

    // Chest accent
    const chestGeo = new THREE.BoxGeometry(0.4, 0.15, 0.05);
    const chestMat = new THREE.MeshStandardMaterial({ color: c.accent, emissive: c.accent, emissiveIntensity: 0.2 });
    const chest = new THREE.Mesh(chestGeo, chestMat);
    chest.position.set(0, 1.25, 0.2);
    group.add(chest);

    // Tactical vest
    const vestGeo = new THREE.BoxGeometry(0.55, 0.5, 0.38);
    const vestMat = new THREE.MeshStandardMaterial({ color: c.accent, roughness: 0.5, metalness: 0.3 });
    const vest = new THREE.Mesh(vestGeo, vestMat);
    vest.position.set(0, 1.1, 0.02);
    group.add(vest);

    // Belt
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.38), MATS.metalDark());
    belt.position.y = 0.7;
    group.add(belt);

    // Radio on belt
    const radio = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.04), MATS.black());
    radio.position.set(0.25, 0.73, 0.18);
    group.add(radio);

    // Antenna
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 4), MATS.metal());
    antenna.position.set(0.25, 0.88, 0.18);
    group.add(antenna);

    // Arms
    for (const side of [-1, 1]) {
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.4, 8), bodyMat);
        upper.position.set(side * 0.38, 1.1, 0);
        upper.castShadow = true;
        group.add(upper);

        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.35, 8), bodyMat);
        forearm.position.set(side * 0.38, 0.7, 0);
        group.add(forearm);

        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.06), MATS.black());
        hand.position.set(side * 0.38, 0.48, 0);
        group.add(hand);
    }

    // Legs
    for (const side of [-1, 1]) {
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.45, 8), MATS.tacticalDark());
        thigh.position.set(side * 0.14, 0.45, 0);
        thigh.castShadow = true;
        group.add(thigh);

        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 8), MATS.tacticalDark());
        shin.position.set(side * 0.14, 0.02, 0);
        group.add(shin);

        const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.2), MATS.black());
        boot.position.set(side * 0.14, -0.04, 0.02);
        group.add(boot);
    }

    // Head — helmet
    const helmetGeo = new THREE.SphereGeometry(0.2, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const helmetMat = new THREE.MeshStandardMaterial({ color: c.accent, roughness: 0.4, metalness: 0.5 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.55;
    helmet.castShadow = true;
    group.add(helmet);

    // Visor
    const visorMat = new THREE.MeshStandardMaterial({
        color: c.visor,
        emissive: c.visor,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.3
    });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.06), visorMat);
    visor.position.set(0, 1.55, 0.14);
    group.add(visor);
    group.visor = visor;

    // Weapon
    const weapon = createSMG();
    weapon.position.set(0.4, 0.85, 0.15);
    group.add(weapon);

    // HP bar (billboard)
    const hpBarGroup = new THREE.Group();
    const hpBarBg = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.08), new THREE.MeshBasicMaterial({color:0x111111,side:THREE.DoubleSide}));
    hpBarGroup.add(hpBarBg);
    const hpBarFg = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.06), new THREE.MeshBasicMaterial({color:0x4caf50,side:THREE.DoubleSide}));
    hpBarFg.position.z = 0.001;
    hpBarGroup.add(hpBarFg);
    hpBarGroup.position.y = 1.8;
    group.add(hpBarGroup);
    group.hpBar = hpBarGroup;
    group.hpBarFg = hpBarFg;

    // Type badge
    if (type === 'elite') {
        const badge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.02), MATS.gold());
        badge.position.set(0.2, 1.35, 0.2);
        group.add(badge);
    }
    if (type === 'commander') {
        const badge = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 0.02), MATS.gold());
        badge.position.set(0.2, 1.35, 0.2);
        group.add(badge);
        // Beret
        const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.06, 8), MATS.red());
        beret.position.set(0, 1.72, 0);
        group.add(beret);
    }

    return group;
}

// ============================================================
// WEAPON MODELS
// ============================================================
export function createPistol() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.2), MATS.metalDark());
    g.add(body);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8), MATS.metal());
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.12);
    g.add(barrel);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.06), MATS.black());
    grip.position.set(0, -0.08, -0.02);
    g.add(grip);
    return g;
}

export function createSMG() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.35), MATS.metalDark());
    g.add(body);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), MATS.metal());
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, 0.22);
    g.add(barrel);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.06), MATS.metal());
    mag.position.set(0, -0.1, 0.05);
    g.add(mag);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.12), MATS.black());
    stock.position.set(0, 0, -0.22);
    g.add(stock);
    return g;
}

export function createRifle() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.5), MATS.metalDark());
    g.add(body);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25, 8), MATS.metal());
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, 0.35);
    g.add(barrel);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.08), MATS.metal());
    mag.position.set(0, -0.08, 0.1);
    g.add(mag);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.18), MATS.black());
    stock.position.set(0, 0, -0.32);
    g.add(stock);
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8), MATS.metal());
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0, 0.06, 0.1);
    g.add(scope);
    return g;
}

export function createShotgun() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.45), MATS.metalDark());
    g.add(body);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), MATS.metal());
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.35);
    g.add(barrel);
    const pump = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.12), MATS.black());
    pump.position.set(0, -0.04, 0.15);
    g.add(pump);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.2), MATS.leather());
    stock.position.set(0, -0.02, -0.28);
    g.add(stock);
    return g;
}

// ============================================================
// CIVILIAN / DISGUISE TARGET
// ============================================================
export function createCivilian() {
    const group = new THREE.Group();

    // Business suit body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.75, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.7 })
    );
    body.position.y = 1.1;
    body.castShadow = true;
    group.add(body);

    // Tie
    const tie = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.35, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x880000 })
    );
    tie.position.set(0, 1.15, 0.16);
    group.add(tie);

    // Collar
    const collar = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.06, 0.15),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    );
    collar.position.set(0, 1.45, 0);
    group.add(collar);

    // Arms
    for (const side of [-1, 1]) {
        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.06, 0.65, 8),
            new THREE.MeshStandardMaterial({ color: 0x1a1a2a })
        );
        arm.position.set(side * 0.35, 1.0, 0);
        group.add(arm);
        const hand = new THREE.Mesh(
            new THREE.BoxGeometry(0.07, 0.08, 0.05),
            MATS.skin()
        );
        hand.position.set(side * 0.35, 0.65, 0);
        group.add(hand);
    }

    // Legs
    for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.07, 0.8, 8),
            new THREE.MeshStandardMaterial({ color: 0x111122 })
        );
        leg.position.set(side * 0.12, 0.4, 0);
        group.add(leg);
        const shoe = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.06, 0.18),
            MATS.black()
        );
        shoe.position.set(side * 0.12, -0.03, 0.03);
        group.add(shoe);
    }

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 10, 8),
        MATS.skin()
    );
    head.position.y = 1.55;
    head.castShadow = true;
    group.add(head);

    // Hair
    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    hair.position.y = 1.6;
    group.add(hair);

    // Glasses
    for (const side of [-1, 1]) {
        const lens = new THREE.Mesh(
            new THREE.CircleGeometry(0.04, 8),
            MATS.glass()
        );
        lens.position.set(side * 0.07, 1.57, 0.14);
        group.add(lens);
    }
    const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.01, 0.01),
        MATS.metal()
    );
    bridge.position.set(0, 1.57, 0.15);
    group.add(bridge);

    // ID badge
    const badge = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.1, 0.01),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.1 })
    );
    badge.position.set(0.15, 1.2, 0.16);
    group.add(badge);

    return group;
}

// ============================================================
// DRONE (floating security drone)
// ============================================================
export function createDrone() {
    const group = new THREE.Group();

    // Body — sphere
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 12, 8),
        MATS.metal()
    );
    body.castShadow = true;
    group.add(body);

    // Ring
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.02, 8, 16),
        MATS.neonCyan()
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Eye / sensor
    const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        MATS.visorRed()
    );
    eye.position.set(0, 0, 0.25);
    group.add(eye);

    // Propellers (visual only)
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4),
            MATS.metalDark()
        );
        arm.position.set(Math.cos(angle) * 0.25, 0.1, Math.sin(angle) * 0.25);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = angle;
        group.add(arm);

        const prop = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.005, 0.02),
            MATS.black()
        );
        prop.position.set(Math.cos(angle) * 0.4, 0.12, Math.sin(angle) * 0.4);
        prop.rotation.y = angle;
        group.add(prop);
    }

    // Bottom light
    const bottomLight = new THREE.PointLight(0xff0000, 0.5, 5);
    bottomLight.position.set(0, -0.3, 0);
    group.add(bottomLight);

    return group;
}

// ============================================================
// HELICOPTER (roof extraction)
// ============================================================
export function createHelicopter() {
    const group = new THREE.Group();

    // Fuselage
    const fuselage = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.8, 2.5, 8, 12),
        MATS.metalDark()
    );
    fuselage.rotation.z = Math.PI / 2;
    fuselage.castShadow = true;
    group.add(fuselage);

    // Cockpit glass
    const cockpit = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 10, 8, 0, Math.PI, 0, Math.PI * 0.5),
        MATS.glass()
    );
    cockpit.position.set(1.2, 0.3, 0);
    cockpit.rotation.z = -Math.PI / 4;
    group.add(cockpit);

    // Tail
    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.3, 0.3),
        MATS.metalDark()
    );
    tail.position.set(-2, 0.2, 0);
    group.add(tail);

    // Tail rotor
    const tailRotor = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.6, 0.05),
        MATS.metal()
    );
    tailRotor.position.set(-3, 0.2, 0.2);
    group.add(tailRotor);

    // Main rotor
    const rotor = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.03, 0.15),
        MATS.metal()
    );
    rotor.position.set(0, 1, 0);
    group.add(rotor);
    group.userData.rotor = rotor;

    // Skids
    for (const side of [-1, 1]) {
        const skid = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 2, 6),
            MATS.metal()
        );
        skid.rotation.z = Math.PI / 2;
        skid.position.set(0, -1, side * 0.6);
        group.add(skid);
    }

    // Navigation lights
    const navRed = new THREE.PointLight(0xff0000, 0.5, 10);
    navRed.position.set(0, -0.5, 1);
    group.add(navRed);
    const navGreen = new THREE.PointLight(0x00ff00, 0.5, 10);
    navGreen.position.set(0, -0.5, -1);
    group.add(navGreen);

    return group;
}

// ============================================================
// HELPER: Create a scene with all characters for preview
// ============================================================
export function createCharacterShowcase(scene) {
    const characters = [];

    // Operator — light armor, rifle
    const op1 = createOperator({ armorLevel: 1, weaponType: 'rifle', hasCyberware: true, helmet: true });
    op1.position.set(-4, 0, 0);
    scene.add(op1);
    characters.push({ model: op1, label: 'OPERATOR (Light/Rifle)' });

    // Operator — heavy armor, shotgun
    const op2 = createOperator({ armorLevel: 3, weaponType: 'shotgun', hasCyberware: false, helmet: true });
    op2.position.set(-2, 0, 0);
    scene.add(op2);
    characters.push({ model: op2, label: 'OPERATOR (Heavy/Shotgun)' });

    // Operator — no armor, pistol, no helmet
    const op3 = createOperator({ armorLevel: 0, weaponType: 'pistol', hasCyberware: true, helmet: false });
    op3.position.set(0, 0, 0);
    scene.add(op3);
    characters.push({ model: op3, label: 'OPERATOR (Stealth)' });

    // Guard — standard
    const g1 = createGuard('standard');
    g1.position.set(2, 0, 0);
    scene.add(g1);
    characters.push({ model: g1, label: 'GUARD' });

    // Guard — elite
    const g2 = createGuard('elite');
    g2.position.set(4, 0, 0);
    scene.add(g2);
    characters.push({ model: g2, label: 'ELITE GUARD' });

    // Guard — commander
    const g3 = createGuard('commander');
    g3.position.set(6, 0, 0);
    scene.add(g3);
    characters.push({ model: g3, label: 'COMMANDER' });

    // Civilian
    const civ = createCivilian();
    civ.position.set(8, 0, 0);
    scene.add(civ);
    characters.push({ model: civ, label: 'CIVILIAN' });

    // Drone
    const drone = createDrone();
    drone.position.set(10, 1.5, 0);
    scene.add(drone);
    characters.push({ model: drone, label: 'DRONE' });

    // Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 4),
        new THREE.MeshStandardMaterial({ color: 0x111120, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(2, 0, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Lights
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(5, 8, 3);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.PointLight(0x00f0ff, 0.5, 20);
    fill.position.set(0, 3, 3);
    scene.add(fill);

    const rim = new THREE.PointLight(0xff6b35, 0.3, 15);
    rim.position.set(5, 2, -3);
    scene.add(rim);

    return characters;
}

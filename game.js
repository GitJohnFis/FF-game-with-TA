document.addEventListener('DOMContentLoaded', () => {
    let exp = 0; // reset to 0 as default
    let health = 100;
    let armor = 10;
    let gold = 50; // change to 50 as default
    let currentWeapon = 0;
    let fighting;
    let monsterHealth;
    let inventory = ["stick"];
    let invincibilityHits = 0;

    const button1 = document.querySelector('#button1');
    const button2 = document.querySelector('#button2');
    const button3 = document.querySelector('#button3');
    const button4 = document.querySelector('#button4');
    const text = document.querySelector('#text');
    const expText = document.querySelector('#expText');
    const healthText = document.querySelector('#healthText');
    const armorText = document.querySelector('#armorText');
    const goldText = document.querySelector('#goldText');
    const monsterName = document.querySelector('#monsterName');
    const monsterHealthText = document.querySelector('#monsterHealth');
    const monsterHealthBar = document.querySelector('#monsterHealth');

    const weapons = [
        { name: 'stick', power: 15 },
        { name: 'dagger', power: 30 },
        { name: 'claw hammer', power: 50 },
        { name: 'sword', power: 100 },
        { name: "Dragon's Fang", power: 150 }
    ];

    const monsters = [
        { name: "slime", level: 2, health: 15 },
        { name: "fanged beast", level: 8, health: 60 },
        { name: "dragon", level: 20, health: 300 },
    ];

    const locations = [
        {
            name: "town square",
            "button text": ["Go to store", "Go to cave", "Fight dragon", "Special Action"],
            "button functions": [goStore, goCave, fightDragon, specialAction],
            text: "You are in the town square. You see a sign that says 'Store'."
        },
        {
            name: "store",
            "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Buy 5 armor (15 gold)", "Go to town square"],
            "button functions": [buyHealth, buyWeapon, buyArmor, goTown],
            text: "You enter the store."
        },
        {
            name: "cave",
            "button text": ["Fight slime", "Fight fanged beast", "Go to town square", "Special Action"],
            "button functions": [fightSlime, fightBeast, goTown, specialAction],
            text: "You enter the cave. You see some monsters."
        },
        {
            name: "fight",
            "button text": ["Attack", "Dodge", "Run", "Special Action"],
            "button functions": [attack, dodge, goTown, specialAction],
            text: "You are fighting a monster."
        },
        {
            name: "kill monster",
            "button text": ["Go to town square", "Go to town square", "Go to town square", "Special Action"],
            "button functions": [goTown, goTown, goTown, specialAction],
            text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
        },
        {
            name: "lose",
            "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "Special Action"],
            "button functions": [restart, restart, restart, specialAction],
            text: "You die. ☠"
        },
        {
            name: "win",
            "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "Special Action"],
            "button functions": [restart, restart, restart, specialAction],
            text: "You defeat the dragon! YOU WIN THE GAME! 🎉"
        },
        {
            name: "easter egg",
            "button text": ["2", "8", "Go to town square?", "Special Action"],
            "button functions": [pickTwo, pickEight, goTown, specialAction],
            text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
        }
    ];

    function update(location) {
        monsterStats.style.display = "none";
        button1.innerText = location["button text"][0];
        button2.innerText = location["button text"][1];
        button3.innerText = location["button text"][2];
        button4.innerText = location["button text"][3];
        button1.onclick = location["button functions"][0];
        button2.onclick = location["button functions"][1];
        button3.onclick = location["button functions"][2];
        button4.onclick = location["button functions"][3];
        text.innerHTML = location.text;
    }

    function buyHealth() {
        if (gold >= 10) {
            gold -= 10;
            health += 10;
            goldText.innerText = gold;
            healthText.innerText = health;
        } else {
            text.innerText = "You do not have enough gold to buy health.";
        }
    }

    function buyWeapon() {
        if (currentWeapon < weapons.length - 1) {
            if (gold >= 30) {
                gold -= 30;
                currentWeapon++;
                goldText.innerText = gold;
                const newWeapon = weapons[currentWeapon].name;
                text.innerText = `You now have a ${newWeapon}.`;
                inventory.push(newWeapon);
                text.innerText += ` In your inventory you have: ${inventory.join(", ")}.`;
            } else {
                text.innerText = "You do not have enough gold to buy a weapon.";
            }
        } else {
            text.innerText = "You already have the most powerful weapon!";
            button2.innerText = "Sell weapon for 15 gold";
            button2.onclick = sellWeapon;
        }
    }

    function sellWeapon() {
        if (inventory.length > 1) {
            gold += 15;
            goldText.innerText = gold;
            const soldWeapon = inventory.shift();
            text.innerText = `You sold a ${soldWeapon}.`;
            text.innerText += ` In your inventory you have: ${inventory.join(", ")}.`;
        } else {
            text.innerText = "Don't sell your only weapon!";
        }
    }

    function buyArmor() {
        if (gold >= 15) {
            gold -= 15;
            armor += 5;
            goldText.innerText = gold;
            armorText.innerText = armor;
        } else {
            text.innerText = "You do not have enough gold to buy armor.";
        }
    }

    function attack() {
        text.innerText = `The ${monsters[fighting].name} attacks.`;
        text.innerText += ` You attack it with your ${weapons[currentWeapon].name}.`;

        const damage = getMonsterAttackValue(monsters[fighting].level);
        if (armor > 0) {
            armor -= damage;
            if (armor < 0) {
                health += armor; // Subtract remaining damage from health
                armor = 0;
            }
        } else {
            if (fighting === 2 && invincibilityHits < 2) {
                invincibilityHits++;
                text.innerText += " You are invincible and take no damage!";
            } else {
                health -= damage;
                if (health < 0) health = 0;
            }
        }

        if (isMonsterHit()) {
            let attackPower = weapons[currentWeapon].power + Math.floor(Math.random() * exp) + 1;
            if (isCriticalHit()) {
                attackPower *= 2;
                text.innerText += " Critical hit!";
            }
            monsterHealth -= attackPower;
            if (monsterHealth < 0) monsterHealth = 0;
            updateMonsterHealthBar(monsterHealth, monsters[fighting].health);
        } else {
            text.innerText += " You miss.";
        }

        armorText.innerText = armor;
        healthText.innerText = health;
        monsterHealthText.innerText = monsterHealth;

        if (health <= 0) {
            lose();
        } else if (monsterHealth <= 0) {
            if (fighting === 2) {
                winGame();
            } else {
                defeatMonster();
            }
        }
    }
    
    function dodge() {
        const dodgeChance = Math.random();
        if (dodgeChance > 0.5) {
            text.innerText = `You successfully dodged the attack from the ${monsters[fighting].name}!`;
        } else {
            text.innerText = `You tried to dodge, but the ${monsters[fighting].name} still hit you!`;
            const damage = getMonsterAttackValue(monsters[fighting].level);
            health -= damage;
            if (health < 0) health = 0;
            healthText.innerText = health;
        }
    }

    function getMonsterAttackValue(level) {
        const hit = (level * 5) - Math.floor(Math.random() * exp);
        return hit > 0 ? hit : 0;
    }

    function isMonsterHit() {
        return Math.random() > 0.2;
    }

    function isCriticalHit() {
        return health < 50; // Critical hit if health is below 50%
    }

    function updateMonsterHealthBar(health, maxHealth) {
        const healthPercentage = (health / maxHealth) * 100;
        monsterHealthBar.style.width = `${healthPercentage}%`;
    }

    function lose() {
        update(locations[5]);
    }

    function winGame() {
        update(locations[6]);
    }

    function restart() {
        exp = 0;
        health = 100;
        armor = 10;
        gold = 50;
        currentWeapon = 0;
        inventory = ["stick"];
        goldText.innerText = gold;
        healthText.innerText = health;
        armorText.innerText = armor;
        expText.innerText = exp;
        goTown();
    }

    function goTown() {
        update(locations[0]);
    }

    function goStore() {
        update(locations[1]);
    }

    function goCave() {
        update(locations[2]);
    }

    function fightSlime() {
        fighting = 0;
        goFight();
    }

    function fightBeast() {
        fighting = 1;
        goFight();
    }

    function fightDragon() {
        fighting = 2;
        goFight();
    }

    function goFight() {
        update(locations[3]);
        monsterHealth = monsters[fighting].health;
        monsterStats.style.display = "block";
        monsterName.innerText = monsters[fighting].name;
        updateMonsterHealthBar(monsterHealth, monsters[fighting].health);
    }

    function defeatMonster() {
        gold += Math.floor(monsters[fighting].level * 6.7);
        exp += monsters[fighting].level;
        armor += monsters[fighting].level;
        goldText.innerText = gold;
        expText.innerText = exp;
        armorText.innerText = armor;
        update(locations[4]);
        setTimeout(goTown, 2000);
    }

    function specialAction() {
        text.innerText = "You performed a special action!";
    }

    function pickTwo() {
        pick(2);
    }

    function pickEight() {
        pick(8);
    }

    function pick(guess) {
        const numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 11));
        text.innerText = `You picked ${guess}. Here are the random numbers:\n${numbers.join(", ")}\n`;
        if (numbers.includes(guess)) {
            text.innerText += "Right! You win 20 gold!";
            gold += 20;
            goldText.innerText = gold;
        } else {
            text.innerText += "Wrong! You lose 10 health!";
            health -= 10;
            healthText.innerText = health;
            if (health <= 0) lose();
        }
    }

    // Initialize buttons
    button1.onclick = goStore;
    button2.onclick = goCave;
    button3.onclick = fightDragon;
    button4.onclick = specialAction;
});
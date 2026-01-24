console.log("Initializing and populating commands...");
const box = document.getElementById('cmds');
const wait = document.getElementById('load');
const fail = document.getElementById('err');
const num = document.getElementById('count');

fetch('https://i.exerinity.com/cmds.json')
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed to load commands");
        }
        return res.json();
    })
    .then(data => {
        box.innerHTML = '';
        fail.innerHTML = '';
        wait.style.display = 'none';
        console.log("Loaded commands - now processing...");

        const list = data.flatMap(cmd => {
            if (cmd.data && Array.isArray(cmd.data)) {
                return cmd.data
                    .filter(item => item.type === 1 && item.name && item.description)
                    .map(item => ({ data: item }));
            } else if (cmd.data && cmd.data.type === 1 && cmd.data.name && cmd.data.description) {
                return [cmd];
            }
            console.log(`Command ${cmd.data?.name || 'Unknown'} is not a valid command, skipping...`);
            return [];
        });

        const groups = {};
        list.forEach(cmd => {
            const text = cmd.data.description || '';
            const match = text.match(/^(🟥|🟨|🟩|🟪|🟦|🟧|⛔|⬛)\s*(\w+)/);
            const label = match ? `${match[1]} ${match[2] || 'Unknown'}` : 'Unknown';
            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(cmd);
        });

        const names = Object.keys(groups).sort();
        let total = 0;

        names.forEach(label => {
            const cmds = groups[label].sort((a, b) =>
                a.data.name.localeCompare(b.data.name)
            );
            total += cmds.length;

            const outer = document.createElement('div');
            outer.className = 'category';

            const head = document.createElement('div');
            head.className = 'category-header';
            head.textContent = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
            const icon = document.createElement('span');
            icon.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            head.appendChild(icon);
            outer.appendChild(head);

            const inner = document.createElement('div');
            inner.className = 'category-content';
            outer.appendChild(inner);

            head.addEventListener('click', () => {
                inner.classList.toggle('show');
                icon.innerHTML = inner.classList.contains('show') ? '<i class="fa-solid fa-chevron-up"></i>' : '<i class="fa-solid fa-chevron-down"></i>';
            });

            cmds.forEach(cmd => {
                const row = document.createElement('div');
                row.className = 'cmd';

                const name = document.createElement('div');
                name.className = 'cmdname';
                name.textContent = `/${cmd.data.name || 'Unknown'}`;
                row.appendChild(name);

                const desc = document.createElement('div');
                desc.className = 'desc';
                let detail = cmd.data.description || 'No description available';
                detail = detail.replace(/^(🟥|🟨|🟩|🟪|🟦|🟧|⛔|⬛)\s*(\w+):\s*/i, '');
                desc.textContent = detail;
                row.appendChild(desc);
                console.log(`Added command ${cmd.data.name} with description ${detail}`);

                if (cmd.data.options && Array.isArray(cmd.data.options) && cmd.data.options.length > 0) {
                    const optbox = document.createElement('div');
                    optbox.className = 'opts';

                    cmd.data.options.forEach(opt => {
                        const optrow = document.createElement('div');
                        optrow.className = 'opt';

                        const tag = opt.required ? ' <span class="req">[required]</span>' : '';
                        let optdesc = opt.description || 'No description';
                        optdesc = optdesc.replace(/^(🟥|🟨|🟩|🟪|🟦|🟧|⛔|⬛)\s*(\w+):\s*/i, '');
                        optrow.innerHTML = `${opt.name || 'Unknown'}${tag}: ${optdesc}`;

                        if (opt.choices && Array.isArray(opt.choices) && opt.choices.length > 0) {
                            const choicelist = document.createElement('div');
                            choicelist.className = 'chs';
                            opt.choices.forEach(choice => {
                                const choiceitem = document.createElement('div');
                                choiceitem.textContent = `- ${choice.name || 'Unknown'}`;
                                choicelist.appendChild(choiceitem);
                                console.log(`Added choice ${choice.name || 'Unknown'} for option ${opt.name || 'Unknown'} for command ${cmd.data.name}`);
                            });
                            optrow.appendChild(choicelist);
                            console.log(`Added choices for option ${opt.name || 'Unknown'} for command ${cmd.data.name}`);
                        }

                        if (opt.options && Array.isArray(opt.options) && opt.options.length > 0) {
                            const sublist = document.createElement('div');
                            sublist.className = 'chs';
                            opt.options.forEach(subopt => {
                                const subrow = document.createElement('div');
                                const subtag = subopt.required ? ' <span class="req">[required]</span>' : '';
                                let subdesc = subopt.description || 'No description';
                                subdesc = subdesc.replace(/^(🟥|🟨|🟩|🟪|🟦|🟧|⛔|⬛)\s*(\w+):\s*/i, '');
                                subrow.innerHTML = `${subopt.name || 'Unknown'}${subtag}: ${subdesc}`;
                                sublist.appendChild(subrow);
                            });
                            optrow.appendChild(sublist);
                            console.log(`Added suboptions for option ${opt.name || 'Unknown'} for command ${cmd.data.name}`);
                        }

                        optbox.appendChild(optrow);
                        console.log(`Added option ${opt.name || 'Unknown'} for command ${cmd.data.name}`);
                    });

                    row.appendChild(optbox);
                    console.log(`Added options for command ${cmd.data.name}`);
                }

                inner.appendChild(row);
            });

            box.appendChild(outer);
        });

        num.textContent = `${total} commands`;
        console.log(`Finalized with ${total} commands across ${names.length} categories`);
        document.getElementById("spins")?.remove();
        document.getElementById("pla")?.remove();
        console.log("Now loading Twemoji...");
        twemoji.parse(document, {
            base: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/',
            size: '72x72',
            ext: '.png'
        });
        console.log("Twemoji loaded successfully");
    })
    .catch(error => {
        wait.style.display = 'none';
        fail.style.display = 'block';
        fail.textContent = `Failed loading commands`;
        console.error('Error:', error);
    });

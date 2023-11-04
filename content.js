(async function () {
    const userId = location.pathname.split("/").pop();
    console.log(userId);
	async function loadUser() {
		const response = await fetch(`/api/v1/users/${userId}`);
		return await response.json();
	}

	const formatter = new Intl.RelativeTimeFormat("en-us", {
		numeric: "auto",
	});

	const DIVISIONS = [
		{ amount: 60, name: "seconds" },
		{ amount: 60, name: "minutes" },
		{ amount: 24, name: "hours" },
		{ amount: 7, name: "days" },
		{ amount: 4.34524, name: "weeks" },
		{ amount: 12, name: "months" },
		{ amount: Number.POSITIVE_INFINITY, name: "years" },
	];

	function formatTimeAgo(date) {
        let duration = (date - new Date()) / 1000;

		for (let i = 0; i < DIVISIONS.length; i++) {
			const division = DIVISIONS[i];
			if (Math.abs(duration) < division.amount) {
                console.log(formatter.format(Math.round(duration), division.name))
				return formatter.format(Math.round(duration), division.name);
			}
			duration /= division.amount;
		}
	}

	const user = await loadUser();

    const userInfo = {
		Id: user.id,
		Created: `${new Date(user.created).toISOString().split('T')[0]} (${formatTimeAgo(new Date(user.created))})`,
		Activated: `${new Date(user.activated).toISOString().split('T')[0]} (${formatTimeAgo(new Date(user.activated))})`,
		LastLogin: `${new Date(user.lastLogin).toISOString().split('T')[0]} (${formatTimeAgo(new Date(user.lastLogin))})`,
	};

	const parentElement = document.querySelector(
		"#admin-user-profile > div.admin-user-profile-header.clearfix"
	);

	let fragment = new DocumentFragment();

	const div = document.createElement("div");
	div.className = "oktap";

	const list = document.createElement("ul");
	list.className = "oktap_list";

	for (const prop in userInfo) {
		const item = document.createElement("li");
		item.textContent = `${prop}: ${userInfo[prop]} `;
		list.appendChild(item);
	}

	fragment.appendChild(div).appendChild(list);

	parentElement.appendChild(fragment);
})();
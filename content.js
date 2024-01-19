(async function () {
    const userId = location.pathname.split("/").pop();

	async function loadUser() {
		const response = await fetch(`/api/v1/users/${userId}`);
		return await response.json();
	}

	async function loadLog() {
		const response = await fetch(`/api/v1/logs?filter=actor.id+eq+%22${userId}%22+and+eventType+sw+%22user%22`);
		return await response.json();
	}

	async function loadM365App() {
			const response = await fetch(`/api/v1/apps/0oa66zua47UzGgdle1t7/users/${userId}`);
			return await response.json();
	}
	
	const user = await loadUser();
	const oktaLog = await loadLog();
	const m365App = await loadM365App();


	// Get device details
	// const eventTypes = Object.groupBy(oktaLog, ({ eventType }) => eventType);
	// const ipAddresses = Object.groupBy(oktaLog.map((x) => x.client.ipAddress), (x)=> x)



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
				return formatter.format(Math.round(duration), division.name);
			}
			duration /= division.amount;
		}
	}


    const userInfo = {
		OktaId: user.id,
		Created: `${new Date(user.created).toISOString().split('T')[0]} (${formatTimeAgo(new Date(user.created))})`,
		Activated: `${new Date(user.activated).toISOString().split('T')[0]} (${formatTimeAgo(new Date(user.activated))})`,
		LastLogin: `${new Date(user.lastLogin).toISOString().split('T')[0]} (${formatTimeAgo(new Date(user.lastLogin))})`,
		ImmutableId: m365App.ok === true ? m365App.profile.immutableId: undefined,
		AzureId: m365App.ok === true ? m365App.externalId: undefined
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
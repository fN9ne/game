function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else{
		document.querySelector('body').classList.add('no-webp');
	}
});;
$(document).ready(function(){
	let burger_btn = $(".burger-menu__button");
	let main_menu = $(".main-menu");
	/*$(document).click(function(e) {
		if (!e.target.closest(".burger-menu")) {
			closeBurger();
		}
	});*/
	burger_btn.click(function() {
		if (!burger_btn.hasClass("active")) {
			burger_btn.addClass("active");
			main_menu.addClass("active");
		}
		else if (burger_btn.hasClass("arrow")) {
			burger_btn.removeClass("arrow");
			$(".menu").removeClass("active");
			main_menu.addClass("active");
		}
		else closeBurger();
	});
	function closeBurger() {
		$(".menu").removeClass("active");
		burger_btn.removeClass("active");
		burger_btn.removeClass("arrow");
	};
	let	tab = $(".tab");
	tab.click(function() {
		let tabLink = $(this).attr("data-link");
		if (typeof(tabLink) == "undefined") {
			/* none */
		}
		else {
			main_menu.removeClass("active");
			for (let i = 0; i < $(".menu").length; i++) {
				let relevantMenu = tabLink + "-menu";
				if ($(".menu").eq(i).hasClass(relevantMenu)) {
					$("." + relevantMenu).addClass("active");
				}
			};
			if ($(".sub-menu.active").length > 0) {
				burger_btn.addClass("arrow");
			}
			else {
				burger_btn.removeClass("arrow");
			}
		}
		if ($(".menu.active").length === 0) closeBurger();
	});

	let shopTab = $(".shop-menu__tab");
	shopTab.each(function(i) {
		$(this).attr("data-num", i);
	});
	function newShopItem() {
		if (getCookie("dpc") == 75) shopTab.eq(1).removeClass("hide");
		if (getCookie("dpc") == 115) shopTab.eq(2).removeClass("hide");
	};

	newShopItem();

	let money;
	let dpc;

	/* если в куках отсутствует запись, то значение money равно 0 */
	if (getCookie("money") == -1) {
		money = 0;
	} else {
		money = +getCookie("money");
		$("#money").html(money);
	};

	/* если в куках отсутствует запись, то значение dpc равно 0 */
	if (getCookie("dpc") == -1) {
		dpc = 1;
	} else {
		dpc = +getCookie("dpc");
	};
	$("#dpc").html(dpc);


	/* покупка dpc */
	$(".dpc").click(function() {
		let thisCost = +$(this).find("span[id=dpcCost]").text();
		let thisBuff = +$(this).find("span[id=dpcBuff]").text();
		if (money < thisCost) {
			alert("Не хватает денег");
		} else {
			dpc += thisBuff;
			money -= thisCost;
			$("#dpc").html(dpc);
			writeCookie("dpc", dpc);
			$("#money").html(money);
			writeCookie("money", money);
			k = K / health * dpc;
			newShopItem();
		};
	});

	/* глобальные переменные */
	let health;
	let K;
	let k;
	let MAX_HEALTH;
	let enemy = $(".enemy");

	if (getCookie("mh") == -1) {
		MAX_HEALTH = enemy.attr("data-health");
	} else {
		MAX_HEALTH = +getCookie("mh");
	}

	if (getCookie("hbp") < 1) {
		K = 100;
	} else {
		K = +getCookie("hbp");
	}

	if (getCookie("health") == -1) {
		health = MAX_HEALTH;
	} else {
		health = +getCookie("health");
	}

	enemy.attr("data-health", MAX_HEALTH);

	k = K / health * dpc;

	/* константы */
	const healthBar = $(".health__current");
	const maxHealth = $("#max_health");
	const currentHealth = $("#current_health");

	/* functions */
	function changeHealth() {
		currentHealth.html(health);
		maxHealth.html(MAX_HEALTH);
	};
	function changeHealthBar() {
		healthBar.attr("data-health", K);
		healthBar.css("width", K + "%");
	};

	/* операции */
	enemy.addClass("active");
	changeHealth();
	changeHealthBar();

	/* атака */
	enemy.click(function(e) {

		if (currentHealth.html() != 0) {
			K -= k;
			K = Math.round(K * 1000) / 1000;
			if (K < 0) K = 0;
			writeCookie("hbp", K);
			health -= dpc;
			writeCookie("health", health);
			stat_damage += +dpc;
			$("#total_damage").html(stat_damage);
			writeCookie("td", stat_damage);
			statDamageRound();
			changeHealthBar();
			changeHealth();

			$(".minus-hp").remove();
			$(this).append(`<span class="minus-hp">-${dpc}</span>`)
			let posX = e.offsetX;
			let posY = e.offsetY;
			$(".minus-hp").css({"top": posY,"left": posX});
		};

		if (currentHealth.html() <= 0) {
			enemy.addClass("defeat");
			setTimeout(removeOldEnemy, 1000);
			currentHealth.html(0);
		};

	});

	function removeOldEnemy() {
		enemy.removeClass("defeat");

		enemy.attr("data-health", Math.round(enemy.attr("data-health") * 1.05));

		MAX_HEALTH = enemy.attr("data-health");
		writeCookie("mh", MAX_HEALTH);
		health = MAX_HEALTH;
		writeCookie("health", health);
		K = 100;
		k = K / health * dpc;
		changeHealth();
		changeHealthBar();
		stat_kills++;
		money++;
		$("#kills").html(stat_kills);
		writeCookie("kills", stat_kills);
		$("#money").html(money);
		writeCookie("money", money);
	};

	/* статистика */
	let stat_kills;
let stat_damage;
if (getCookie("kills") == -1) {
	stat_kills = 0;
} else {
	stat_kills = +getCookie("kills");
}
$("#kills").html(stat_kills);
if (getCookie("td") == -1) {
	stat_damage = 0;
} else {
	stat_damage = +getCookie("td");
}
$("#total_damage").html(stat_damage);
statDamageRound();
function statDamageRound() {
	let total_damage_num = +$("#total_damage").html();
	if (total_damage_num > 1000000) {
		$("#total_damage").addClass("million");
		let eq = total_damage_num/1000000;
		$("#total_damage").html(Math.round(eq*100)/100);
	}
	if (total_damage_num > 1000000000) {
		$("#total_damage").addClass("billion");
		let eq = total_damage_num/1000000000;
		$("#total_damage").html(Math.round(eq*100)/100);
	}
	if (total_damage_num > 1000000000000) {
		$("#total_damage").addClass("trillion");
		let eq = total_damage_num/1000000000000;
		$("#total_damage").html(Math.round(eq*100)/100);
	}
};;

	/* очистка */
	$(".tab[data-link=null]").click(function() {
	$(".null-confirm").addClass('active');
	$(".null-confirm__video").removeClass("hide");
	$(".null-confirm__video")[0].play();
	$(".null-confirm__sure").addClass("hide");
});
$(".null-confirm__video").on("ended", function() {
	$(this).addClass("hide");
	$(".null-confirm__sure").removeClass("hide");
});
$(".null-confirm__video")[0].volume = 0.4;
$(".null-confirm__yes").click(function() {
	document.cookie = "dpc=-1;max-age=-1;";
	document.cookie = "money=-1;max-age=-1;";
	document.cookie = "td=-1;max-age=-1;";
	document.cookie = "kills=-1;max-age=-1;";
	document.cookie = "hbp=-1;max-age=-1;";
	document.cookie = "health=-1;max-age=-1;";
	document.cookie = "mh=-1;max-age=-1;";
});
$(".null-confirm__area, .null-confirm__no").click(function() {
	$(".null-confirm").removeClass('active');
	$(".null-confirm__video")[0].pause();
});;

	/* подключение функций */
	function getCookie(name) {
	name += "=";
	let beg = document.cookie.indexOf(name);
	if (beg == -1) return -1;
	else beg += name.length;
	let end = document.cookie.indexOf(";", beg);
	if (end == -1) end = document.cookie.length;
	return document.cookie.substring(beg, end);
};
function writeCookie(cookieName, cookieValue) {
	document.cookie = `${cookieName}=${cookieValue};max-age=48004800;`;
};;
});
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

	if (getCookie("max_health") > -1) {
		document.cookie = "max_health=-1;max-age=-1;";
	}

	let shopTab = $(".shop-menu__tab");
	shopTab.each(function(i) {
		$(this).attr("data-num", i);
	});
	function newShopItem() {
		if (getCookie("dpc") >= 10) shopTab.eq(1).removeClass("hide");
		if (getCookie("dpc") >= 50) shopTab.eq(2).removeClass("hide");
		if (getCookie("dpc") >= 100) shopTab.eq(3).removeClass("hide");
		if (getCookie("dpc") >= 240) shopTab.eq(4).removeClass("hide");
		if (getCookie("dpc") >= 375) shopTab.eq(5).removeClass("hide");
		if (getCookie("money") >= 15) $(".reload").removeClass("hide")
			else {$(".reload").addClass("hide")}
		};

	newShopItem();


	/*updates*/
	if (getCookie("update") == -1) {
		$(".update").addClass("active");
	} else {
		$(".update").removeClass("active");
	}
	$(".update__btn").click(function() {
		document.cookie = "update=1;max-age=48004800;"
		clearCookie();
	});


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
	$(".dpc").click(function(e) {
		let thisCost = +$(this).find("span[id=dpcCost]").text();
		let thisBuff = +$(this).find("span[id=dpcBuff]").text();
		if (money < thisCost) {
			$(this).addClass("not-enough");
			$(this).append(`<span class="not-enough__elipse"></span>`);
			let posX = e.offsetX;
			let posY = e.offsetY;
			$(".not-enough__elipse").css({"top": posY, "left": posX});
			setTimeout(() => {
				$(".not-enough__elipse").remove();
				$(this).removeClass("not-enough");
			}, 1000)
		} else {
			if ($(this).hasClass("mult")) {
				dpc *= 2;
				money -= thisCost;
			} else {
				dpc += thisBuff;
				money -= thisCost;
			}
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
	let enemy_num;
	let cnt = $(".content");
	if (getCookie("cEn") == -1) {
		enemy_num = 0;
	} else {
		enemy_num = +getCookie("cEn");
	}
	let enemy = $(".enemy");
	let this_enemy = enemy.eq(enemy_num);

	if (getCookie("mh") == -1) {
		MAX_HEALTH = cnt.attr("data-health");
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

	let stat_money;

	if (getCookie("tc") == -1) {
		stat_money = 0;
	} else {
		stat_money = +getCookie("tc");
	}

	cnt.attr("data-health", MAX_HEALTH);

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
	this_enemy.addClass("active");
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
			this_enemy.addClass("defeat");
			setTimeout(removeOldEnemy, 1000);
			currentHealth.html(0);
		};

	});

	function removeOldEnemy() {
		cnt.attr("data-health", Math.round(cnt.attr("data-health") * 1.075));
		this_enemy.removeClass("active");
		this_enemy.removeClass("defeat");
		enemy_num++;
		if (enemy_num == enemy.length) {
			enemy_num = -1;
			removeOldEnemy();
			return false;
		}
		this_enemy = enemy.eq(enemy_num);
		this_enemy.addClass("active");
		writeCookie("cEn", enemy_num);
		if (cnt.attr("data-health") >= 1000000) {
			money += 16;
			stat_money +=16;
		}
		else if (cnt.attr("data-health") >= 250000) {
			money += 8;
			stat_money +=8;
		}
		else if (cnt.attr("data-health") >= 50000) {
			money += 4;
			stat_money +=4;
		}
		else if (cnt.attr("data-health") >= 5000) {
			money += 2;
			stat_money +=2;
		}
		if (cnt.attr("data-health") < 5000) {
			money++;
			stat_money++;
		}

		stat_kills++;
		$("#kills").html(stat_kills);
		writeCookie("kills", stat_kills);
		$("#money").html(money);
		writeCookie("money", money);
		$("#tc").html(stat_money);
		writeCookie("tc", stat_money);

		MAX_HEALTH = cnt.attr("data-health");
		writeCookie("mh", MAX_HEALTH);
		health = MAX_HEALTH;
		writeCookie("health", health);
		K = 100;
		k = K / health * dpc;
		changeHealth();
		changeHealthBar();
		newShopItem();
	};

	$(".reload").click(function() {
		$(".null-confirm").addClass('active');
		$(".null-confirm__sure").removeClass("hide");
		$(".null-confirm__yes").removeClass("yes-null");
		$(".null-confirm__yes").addClass("yes-reload");
	});

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
	$(".null-confirm__yes").addClass("yes-null");
	$(".null-confirm__yes").removeClass("yes-reload");
	$(".null-confirm__sure").removeClass("hide");
});
function clearCookie() {
	document.cookie = "dpc=-1;max-age=-1;";
	document.cookie = "money=-1;max-age=-1;";
	document.cookie = "td=-1;max-age=-1;";
	document.cookie = "kills=-1;max-age=-1;";
	document.cookie = "hbp=-1;max-age=-1;";
	document.cookie = "health=-1;max-age=-1;";
	document.cookie = "mh=-1;max-age=-1;";
	document.cookie = "cEn=-1;max-age=-1";
	document.cookie = "tc=-1;max-age=-1";
};
$(".null-confirm__yes").click(function() {
	if ($(this).hasClass("yes-null")) {
		clearCookie();
	}
	if ($(this).hasClass("yes-reload")) {
		enemy_num = 0;
		MAX_HEALTH = cnt.attr("data-base");
		health = MAX_HEALTH;
		money -= 15;
		moneyK = money / 100 * 30;
		money -= moneyK.toFixed();
		dpcK = dpc / 100 * 40;
		dpc -= dpcK.toFixed();
		writeCookie("dpc", dpc);
		writeCookie("money", money);
		writeCookie("mh", MAX_HEALTH);
		writeCookie("health", health);
	}
});
$(".null-confirm__area, .null-confirm__no").click(function() {
	$(".null-confirm").removeClass('active');
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
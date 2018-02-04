/*

LEGO OpenSCAD library to build any kind of LEGO pieces.
Copyright (C) 2018 Critter Bots

Instagram: @critterbots
Mail to: critterbots@gmail.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

var model_fn = 360;

function pin_hole(di, de)
{
	if (typeof di == "undefined") {
		var di = 4.8;
	}
	if (typeof de == "undefined") {
		var de = 6.2;
	}

	var ri = di / 2;
	var re = de / 2;

	return union(
		linear_extrude({height: 7.9}, circle({r: ri, center: true, fn: model_fn})),
		linear_extrude({height: 0.9}, circle({r: re, center: true, fn: model_fn})).translate([0, 0, 0]),
		linear_extrude({height: 0.9}, circle({r: re, center: true, fn: model_fn})).translate([0, 0, 7.1])
	);
}

function pin_border(de, di)
{
	if (typeof de == "undefined") {
		var de = 7.2;
	}
	if (typeof di == "undefined") {
		var di = 4.8;
	}

	var ri = di / 2;
	var re = de / 2;

	return linear_extrude({height: 7.9}, difference(
			circle({r: re, center: true, fn: model_fn}),
			circle({r: ri, center: true, fn: model_fn})
		)
	).translate([0, 0, 0.05]);
}

function beam(size, bevel_left, bevel_right)
{
	if (typeof size == "undefined") {
		var size = 1;
	}
	if (typeof bevel_left == "undefined") {
		var bevel_left = false;
	}
	if (typeof bevel_right == "undefined") {
		var bevel_right = false;
	}

	var o = hull(
		circle({r: 3.95, center: true, fn: model_fn}).translate([4, 4, 0]),
		circle({r: 3.95, center: true, fn: model_fn}).translate([size * 8 - 4, 4, 0])
	);

	if (bevel_left) {
		o = union(o, square([size * 8 - 0.1, 3.95]).translate([0.05, 0.05, 0]));
	}

	if (bevel_right) {
		o = union(o, square([size * 8 - 0.1, 3.95]).translate([0.05, 4, 0]));
	}

	o = difference(
		linear_extrude({height: 7.9}, o).translate([0, 0, 0.05]),
		linear_extrude({height: 3},
			hull(
				circle({r: 3.1, center: true, fn: model_fn}).translate([4, 4, 0]),
				circle({r: 3.1, center: true, fn: model_fn}).translate([size * 8 - 4, 4, 0])
			)
		).translate([0, 0, 0.05])
	);

	o = difference(o,
		linear_extrude({height: 3},
			hull(
				circle({r: 3.1, center: true, fn: model_fn}).translate([4, 4, 0]),
				circle({r: 3.1, center: true, fn: model_fn}).translate([size * 8 - 4, 4, 0])
			)
		).translate([0, 0, 5])
	);

	for (var i = 0; i < size; i++) {
		o = union(o, pin_border().translate([4 + (i * 8), 4, 0]));
	}

	for (var i = 0; i < size; i++) {
		o = difference(o, pin_hole().translate([4 + (i * 8), 4, 0]));
	}

	return o;
}

function plate(ux, uy, bevel_x, bevel_y, nerv_x, nerv_y)
{
	if (typeof bevel_x == "undefined") {
		bevel_x = false;
	}
	if (typeof bevel_y == "undefined") {
		bevel_y = false;
	}
	if (typeof nerv_x == "undefined") {
		nerv_x = false;
	}
	if (typeof nerv_y == "undefined") {
		nerv_y = false;
	}

	var lx = (ux * 8) - 0.1;
	var ly = (uy * 8) - 0.1;
	var h = 0.85;
	var o = square([lx, ly]);

	if (bevel_x) {
		o = difference(o,
			hull(
				circle({r: 3.1, center: true, fn: model_fn}).translate([3.95, 3.95, 0]),
				circle({r: 3.1, center: true, fn: model_fn}).translate([(ux - 1) * 8 + 3.95, 3.95, 0])
			),
			square([uy * 8, 4]).translate([0, 0, 0]),
			hull(
				circle({r: 3.1, center: true, fn: model_fn}).translate([3.95, (uy - 1) * 8 + 3.95, 0]),
				circle({r: 3.1, center: true, fn: model_fn}).translate([(ux - 1) * 8 + 3.95, (uy - 1) * 8 + 3.95, 0])
			),
			square([uy * 8, 4]).translate([0, (uy - 1) * 8 + 3.9, 0])
		);
	}

	o = linear_extrude({height: h}, o);

	var elx = (bevel_y ? lx + ( h * 2) - 16 : lx);
	var ely = (bevel_x ? ly + (h * 2) - 16 : ly);
	var epx = (bevel_y ? 8 - h : 0);
	var epy = (bevel_x ? 8 - h : 0);

	if (nerv_x) {
		var dx = elx / (nerv_x + 1);
		for (var i = 1; i <= nerv_x; i++) {
			o = union(o,
				linear_extrude({height: h * 2}, square([h * 2, ely])).translate([i * dx + epx, epy, h])
			);
		}
	}

	if (nerv_y) {
		var dy = ely / (nerv_y + 1);
		for (var i = 1; i<= nerv_y; i++) {
			o = union(o,
				linear_extrude({height: h * 2}, square([elx, h * 2])).translate([epx, i * dy + epy, h])
			);
		}
	}

	return o.translate([0.05, 0.05, 0.05]);
}

function screw_hole(m, h)
{
	var mt = [];
	mt["M3"] = { r: 1.9 };

	return cylinder({h: h, r1: mt[m].r, r2: mt[m].r, center: true, fn: model_fn}).translate([0, 0, h / 2]);
}

function nut_hole(m)
{
	var mt = [];
	mt["M3"] = { r: 3.3, h: 2.4 };

	return cylinder({h: mt[m].h, r1: mt[m].r, r2: mt[m].r, center: true, fn: 6}).translate([0, 0, mt[m].h / 2]);
}

function screw_tower(m, h)
{
	var mt = [];
	mt["M3"] = { r1: 4.8, r2: 2.8, h1: 4, h2: h - 4 };

	return union(
		cylinder({h: mt[m].h1, r1: mt[m].r1, r2: mt[m].r1, center: true, fn: model_fn}).translate([0, 0, mt[m].h1 / 2]),
		cylinder({h: mt[m].h2, r1: mt[m].r2, r2: mt[m].r2, center: true, fn: model_fn}).translate([0, 0, mt[m].h1 + (mt[m].h2 / 2)])
	);
}

function main()
{
	return union(
		beam(7, false, true),
		beam(7, true, false).translate([0, 80, 0]),
		difference(
			union(
				plate(7, 11, true, false, 2, 3).setColor([128, 0, 0]).translate([0, 0, 0]),
				screw_tower("M3", 6.1).setColor([0, 128, 128]).translate([7.68,16.06, 0.05]),
				screw_tower("M3", 6.1).setColor([0, 128, 128]).translate([48.32, 16.06, 0.05]),
				screw_tower("M3", 6.1).setColor([0, 128, 128]).translate([7.68, 71.94, 0.05]),
				screw_tower("M3", 6.1).setColor([0, 128, 128]).translate([48.32, 71.94, 0.05])
			),
			screw_hole("M3", 6.1).translate([7.68, 16.06, 0.05]),
			nut_hole("M3").translate([7.68, 16.06, 0.05]),
			screw_hole("M3", 6.1).translate([48.32, 16.06, 0.05]),
			nut_hole("M3").translate([48.32, 16.06, 0.05]),
			screw_hole("M3", 6.1).translate([7.68, 71.94, 0.05]),
			nut_hole("M3").translate([7.68, 71.94, 0.05]),
			screw_hole("M3", 6.1).translate([48.32, 71.94, 0.05]),
			nut_hole("M3").translate([48.32, 71.94, 0.05])
		),
		rotate([0, 90, 0], plate(1, 10).setColor([0, 128, 0])).translate([0, 4, 8]),
		rotate([0, 270, 0], plate(1, 10).setColor([128, 128, 0])).translate([56, 4, 0])
	);
}

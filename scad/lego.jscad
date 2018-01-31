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

var model_fn = 12;

function pin_hole(di, de)
{
	if (typeof di == "undefined") {
		var di = 5;
	}
	if (typeof de == "undefined") {
		var de = 6.2;
	}

	var ri = di / 2;
	var re = de / 2;

	return union(
		linear_extrude({height: 8}, circle({r: ri, center: true, fn: model_fn})),
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
		var di = 5;
	}

	var ri = di / 2;
	var re = de / 2;

	return difference(
		linear_extrude({height: 7.9}, difference(
			circle({r: re, center: true, fn: model_fn}),
			circle({r: ri, center: true, fn: model_fn})
		).translate([0, 0, 0.05])
	));
}

function beam(size)
{
	if (typeof size == "undefined") {
		var size = 1;
	}

	var o =
		linear_extrude({height: 7.9},
			hull(
				circle({r: 3.95, center: true, fn: model_fn}).translate([4, 4, 0]),
				circle({r: 3.95, center: true, fn: model_fn}).translate([size * 8 - 4, 4, 0])
			)
		).translate([0.05, 0.05, 0.05])
	;

	o = difference(o,
		linear_extrude({height: 3},
			hull(
				circle({r: 3.1, center: true, fn: model_fn}).translate([4, 4, 0]),
				circle({r: 3.1, center: true, fn: model_fn}).translate([size * 8 -4, 4, 0])
			)
		).translate([0, 0, 0])
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
		o = union(o, pin_border().translate([4 + (i * 8), 4, 0.05]));
	}

	for (var i = 0; i < size; i++) {
		o = difference(o, pin_hole().translate([4 + (i * 8), 4, 0]));
	}

	return o;
}

function plate(ux, uy, bevel_x, bevel_y)
{
	if (typeof bevel_x == "undefined") {
		bevel_x = false;
	}
	if (typeof bevel_y == "undefined") {
		bevel_y = false;
	}

	var o = square((ux * 8) - 0.1, (uy * 8) - 0.1);
	if (bevel_x) {
		o = difference(o,
			hull(
				circle(2.95, true).translate([1, 1, 0]),
				circle(2.95, true).translate([(ux - 1) * 8 + 1, 1, 0])
			),
			square(4, uy * 8).translate([0, 0, 0]),
			hull(
				circle(2.95, true).translate([1, (uy - 3) * 8 + 1, 0]),
				circle(2.95, true).translate([(ux - 1) * 8 + 1, (uy - 3) * 8 + 1, 0])
			)
		);
	}

	return linear_extrude({height: 1}, o).translate([0.05, 0.05, 0.05]);
}

function main()
{
	return union(
		//beam(7),
		plate(7, 9, true).translate([0, 0, 0], false, true)/*,
		beam(7).translate([0, 48, 0])*/
	);
}

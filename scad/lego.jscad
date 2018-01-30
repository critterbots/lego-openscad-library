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

var model_fn = 36;

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

	var o = [];
	o.push(
		linear_extrude({height: 7.9},
			hull(
				circle({r: 3.95, center: true, fn: model_fn}).translate([4, 4, 0]),
				circle({r: 3.95, center: true, fn: model_fn}).translate([size * 8 - 4, 4, 0])
			)
		).translate([0.05, 0.05, 0.05])
	);
	o.push(
		linear_extrude({height: 3},
			hull(
				circle({r: 3.1, center: true, fn: model_fn}).translate([4, 4, 0]),
				circle({r: 3.1, center: true, fn: model_fn}).translate([size * 8 -4, 4, 0])
			)
		).translate([0, 0, 0])
	);
	o.push(
		linear_extrude({height: 3},
			hull(
				circle({r: 3.1, center: true, fn: model_fn}).translate([4, 4, 0]),
				circle({r: 3.1, center: true, fn: model_fn}).translate([size * 8 - 4, 4, 0])
			)
		).translate([0, 0, 5])
	);
	o.push(pin_hole().translate([4, 4, 0]));
	for (var i = 1; i < size; i++) {
		o.push(pin_hole().translate([4 + (i * 8), 4, 0]));
	}

	o = difference(o);

	for (var i = 0; i < size; i++) {
		o.union(pin_border().translate([4 + (i * 8), 4, 0]));
	}

	o = union(o);

	return difference(
		union(
			difference(o/*,
			for ( i = [0: size - 1]) {
				pin_border().translate([4 + (i * 8), 4, 0]);
			}*/
			)
		) /*,
		for ( i = [0: size - 1]) {
			pin_hole().translate([i * 8 + 4, 4, 0]);
		}*/
	);
}

var letters = [
	[
		[ 0, 1, 1, 1, 1, 0 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 0, 0, 0, 0, 0, 1 ],
		[ 0, 0, 0, 0, 1, 1 ],
		[ 0, 0, 0, 1, 1, 0 ],
		[ 0, 0, 0, 0, 1, 1 ],
		[ 0, 0, 0, 0, 0, 1 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 0, 1, 1, 1, 1, 0 ]
	],
	[
		[ 0, 1, 1, 1, 1, 0 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 0, 1, 1, 1, 1, 0 ]
	],
	[
		[ 0, 1, 1, 1, 1, 0 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 0, 1, 1, 1, 1, 0 ]
	],
	[
		[ 0, 1, 1, 1, 1, 0 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 0, 0, 0, 0, 1 ],
		[ 1, 1, 0, 0, 1, 1 ],
		[ 0, 1, 1, 1, 1, 0 ]
	]
];

/*
module paint(start = -1, i = 0, j = 0, k = 0) {
	if (k == 5) {
		if (start > -1) {
			if (letters[i][j][k] == 0) {
				translate([(i * 7 + start) * 8, j * 8, 0]) beam(k - start);
			} else {
				translate([(i * 7 + start) * 8, j * 8, 0]) beam(k + 1 - start);
			}
		} else if (letters[i][j][k] == 1) {
			translate([(i * 7 + k) * 8, j * 8, 0]) beam(1);
		}
	} else if (start > -1 && letters[i][j][k] == 0) {
		translate([(i * 7 + start) * 8, j * 8, 0]) beam(k - start);
		paint(start = -1, i = i, j = j, k = k + 1);
	} else if (start == -1 && letters[i][j][k] == 1) {
		paint(start = k, i = i, j = j, k = k + 1);
	} else {
		paint(start = start, i = i, j = j, k = k + 1);
	}
}
*/

function main()
{
	return beam(3);
}
/*
color("green")
	for ( i = [0:3]) {
		for ( j = [0:8]) {
			paint(i = i, j = j);
		}
	}
;
*/

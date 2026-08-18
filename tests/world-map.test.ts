import * as assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { JOURNEY_COURSES, getCourseStations } from "../lib/journey-data";

interface WorldMapData {
  viewBox: string;
  countries: { code: string; d: string; bbox: [number, number, number, number] }[];
}

const mapData: WorldMapData = JSON.parse(readFileSync("public/journey/world-map.json", "utf8"));
const mapCodes = new Set(mapData.countries.map((c) => c.code));

test("world-map.json has valid structure", () => {
  assert.equal(mapData.viewBox, "0 0 1000 520");
  assert.ok(mapData.countries.length >= 150, `country count ${mapData.countries.length} >= 150`);
  for (const c of mapData.countries) {
    assert.match(c.code, /^[a-z]{2}$/, `code ${c.code} is alpha-2 lowercase`);
    assert.ok(c.d.startsWith("M"), `path for ${c.code} starts with M`);
    assert.equal(c.bbox.length, 4);
    assert.ok(c.bbox[2] > 0 && c.bbox[3] > 0, `bbox for ${c.code} has positive size`);
  }
});

test("map codes are unique", () => {
  assert.equal(mapCodes.size, mapData.countries.length);
});

test("every map-quiz station has a polygon on the map", () => {
  const course = JOURNEY_COURSES.find((c) => c.id === "map-quiz");
  assert.ok(course, "map-quiz course exists");
  const stations = getCourseStations(course!);
  assert.ok(stations.length >= 150, `station count ${stations.length} >= 150`);
  for (const st of stations) {
    assert.ok(mapCodes.has(st.id), `station ${st.id}(${st.name}) has a map polygon`);
  }
});

test("map-quiz stations have no duplicate ids or names", () => {
  const course = JOURNEY_COURSES.find((c) => c.id === "map-quiz")!;
  const stations = getCourseStations(course);
  assert.equal(new Set(stations.map((s) => s.id)).size, stations.length, "ids unique");
  assert.equal(new Set(stations.map((s) => s.name)).size, stations.length, "names unique");
});

test("flag-quiz course is unchanged by the refactor", () => {
  const course = JOURNEY_COURSES.find((c) => c.id === "flag-quiz")!;
  const stations = getCourseStations(course);
  assert.equal(stations.length, 200);
  assert.equal(stations[0].id, "kr");
  assert.equal(stations[0].name, "대한민국");
});

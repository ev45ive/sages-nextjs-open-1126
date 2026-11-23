type TOP = unknown; //any

type Owoce = "banan" | "jablko" | "jablko" | "jablko" | never | never 
type Warzywa = "marchewka"; // |'pietruszka'; // | string

type BOTTOM = never;

type Jedzenie = Owoce | Warzywa;

const jedznie: Jedzenie = "banan";

const x = 123;
let y = 123;

// x === 234

function coZjesz(jedzeni: Jedzenie) {
  if (jedzeni == "banan") {
    jedzeni == "banan";
  } else if (jedzeni == "jablko" || jedzeni == "marchewka") {
    jedzeni;
  } else {
    // exhausiveness check
    jedzeni satisfies never; // TS Compile check
    throw new Error("niedozwolone jedznie"); // JS runtime
  }
}

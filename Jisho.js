import Config from "./Config";

export const jishoPartsOfSpeech = {
	"Suru verb - irregular": "V-SURU",
	Expression: "EXPR",
	Noun: "Noun",
	"I-adjective": "I-Adj",
	"Na-adjective": "Na-Adj",
	Adverb: "Adv",
	"Godan verb with u ending": "V5-U",
	"Godan verb with ku ending": "V5-U",
	"Godan verb with su ending": "V5-U",
	"Godan verb with tsu ending": "V5-U",
	"Godan verb with nu ending": "V5-U",
	"Godan verb with bu ending": "V5-U",
	"Godan verb with mu ending": "V5-U",
	"Godan verb with ru ending": "V5-U",
	Particle: "Particle",
	"Wikipedia definition": "Wiki",
	Numeric: " Num.",
};

export default class Jisho {
	static JISHO_URL(query) {
		return `https://jisho.org/api/v1/search/words?keyword=${query}`;
	}

	static decypher(queryResult) {
		const [status, data] = [queryResult.meta.status, queryResult.data];
		if (status !== 200) {
			throw new Error(`Jisho request error: ${status}`);
		}

		const makeDefinition = (data) => {
			const {slug, is_common, tags, jlpt, japanese, senses} = data;

			// japanese: {word, reading}
			const topJapanese = japanese[0];
			const otherJapanese = japanese.slice(1);

			const topSense = senses[0];

			// Use the part of speech from the first sense, it's easer this way
			const referencePartOfSpeech = topSense.parts_of_speech.join(", ");
			const firstPartOfSpeech = topSense.parts_of_speech[0];
			const wanikaniLevel = tags.includes("wanikani") ? +tags.replace("wanikani", "") : undefined;
			const jlptLevel =
				jlpt.length > 0
					? +jlpt
							.sort((a, b) => {
								const lv1 = +a.split("-n")[1];
								const lv2 = +b.split("-n")[1];
								return lv2 - lv1;
							})[0]
							.split("-n")[1]
					: undefined;
			return {
				slug,
				info: {
					firstPartOfSpeech: firstPartOfSpeech,
					partsOfSpeech: referencePartOfSpeech,
					isCommon: is_common,
					wanikani: wanikaniLevel,
					jlpt: jlptLevel,
				},
				word: topJapanese.word || topJapanese.reading,
				reading: !topJapanese.word ? "" : topJapanese.reading,
				moreForms: otherJapanese,
				meanings: senses.map((sense) => {
					return {
						translation: sense.english_definitions.join("; "),
						restrictions: sense.restrictions,
					};
				}),
			};
		};
		const map = data.filter((v, i) => i < +Config.MAX_CARDS[2]).map((d) => makeDefinition(d));
		return map;
	}

	async makeQuery(query, noCache) {
		const possibleCache = this.cache[query];
		if (possibleCache && !noCache) {
			return possibleCache;
		} else {
			const fetchedData = await fetch(Jisho.JISHO_URL(query), {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			const fetched = await fetchedData.json();
			const final = Jisho.decypher(fetched);

			this.cache[query] = final;
			return final;
		}
	}

	constructor() {
		this.cache = {};
	}

	async word(word, noCache = false) {
		const queryResult = await this.makeQuery(word, noCache);
		return queryResult;
	}
}

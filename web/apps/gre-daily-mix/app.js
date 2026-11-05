/* GRE Daily Mix: a 20-minute mixed set every day, half verbal and half quant, with a streak. */
(function () {
  'use strict';
  const KEY = 'gre-daily-mix.days';
  const QUANT = ['percentOf', 'percentChange', 'linear', 'quadratic', 'hypotenuse', 'mean', 'qcSwap', 'ratioSplit', 'remainder', 'choose', 'slope', 'work'];
  // Four completion questions, four vocabulary questions and eight quant questions: the same set all day.
  const today = (data, day) => {
    const seed = SK.daySeed('gre-daily-mix', day), r = SK.rng(seed);
    return SK.fromBank(r, data.tc, 'All', 2).concat(SK.fromBank(r, data.se, 'All', 2), SK.wordItems(data.gre_words, 4, seed, ['meaning', 'blank']), SK.makeQuant(QUANT, 8, seed));
  };
  const App = {
    about: 'Twenty minutes, every day: two text completions, two sentence equivalence, four vocabulary questions and eight generated quant questions. The set stays the same all day, and a streak counts the days in a row you finish it.',
    how: ['Open the app each day and press **Start**.', 'Do it at the same time each day to build the habit.', 'Missed questions go to the GRE Error Log.'],
    tabs: [{ id: 'today', label: 'Today', render(el, ctx) {
      const days = SK.store.get(KEY, {}), d = SK.dayKey();
      el.appendChild(SK.card('Today\'s mix', SK.stats([['Day streak', SK.streak(Object.keys(days))], ['Days done', Object.keys(days).length], ['Today', days[d] ? days[d] + ' / 16' : 'Not yet']]),
        SK.btn(days[d] ? 'Do it again' : 'Start', () => SK.quiz(el, today(ctx.data, d), { title: 'Daily mix, ' + d, mode: 'practice', onFinish: (sum) => { const all = SK.store.get(KEY, {}); all[d] = Math.max(all[d] || 0, sum.correct); SK.store.set(KEY, all); } }), '', { 'data-auto': 'once' })));
    } }],
    today,
    checks: { 'sixteen valid questions that stay the same all day': (data, assert) => {
      const a = today(data, '2026-11-05');
      assert.equal(a.length, 16);
      assert.deepEqual(a.map((x) => x.id), today(data, '2026-11-05').map((x) => x.id));
      for (const it of a) assert.deepEqual(SK.validateItem(it), []);
    } },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();

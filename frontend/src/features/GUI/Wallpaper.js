// Desktop wallpaper: a poster of Rubick, the Grand Magus, with his spells written as code.
// Hero render from Valve's Dota 2 CDN, re-encoded to frontend/public/wallpaper/rubick.webp; artwork © Valve.
const CODE = [
    '// the grand magus of the codebase',
    'function spellSteal(spell) {',
    '    return structuredClone(spell);   // git clone, basically',
    '}',
    'const lastCast = enemy.history.at(-1);',
    'const stolen = spellSteal(lastCast);',
    '',
    'telekinesis.lift(target).then(throwAt(cursor));',
    'fadeBolt.bounce(targets).forEach(t => t.damage -= 25);',
    'const NullField = () => null;',
    '',
    'while (fight.ongoing) {',
    '    steal(); cast(); repeat();',
    '}',
    'export default Rubick;',
].join('\n');

const Wallpaper = () => (
    <div className='wallpaper' aria-hidden='true'>
        <div className='wallpaperGlow'/>
        <pre className='wallpaperCode'>{CODE}</pre>
        <pre className='wallpaperCode second'>{CODE}</pre>
        <img className='wallpaperHero' src={`${process.env.PUBLIC_URL}/wallpaper/rubick.webp`} alt=''/>
        <div className='wallpaperTitle'>
            RUBICK
            <span>grand magus · spell steal · git clone</span>
        </div>
        <div className='wallpaperCredit'>Rubick, Dota 2. Artwork © Valve</div>
    </div>
);

export default Wallpaper;

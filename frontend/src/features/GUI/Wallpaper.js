// Desktop wallpaper: a Rubick poster with his spells written as faint code. Artwork © Valve.
export const WALLPAPERS = ['rubick-trailer.jpg', 'rubick-stargazer.jpg'];

// Picked once per page load, so every visit gets one of the two at random.
export const picked = WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)];

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
    <div className='wallpaper' aria-hidden='true' data-wallpaper={picked}
         style={{backgroundImage: `url(${process.env.PUBLIC_URL}/wallpaper/${picked})`}}>
        <div className='wallpaperShade'/>
        <pre className='wallpaperCode'>{CODE}</pre>
        <div className='wallpaperTagline'>
            <span>front-end &amp; full-stack engineer · react · next.js · node.js · amman, jordan</span>
            <span>graphic designer by degree · terminals · dota 2 · chess · horses · music</span>
        </div>
        <div className='wallpaperCredit'>Rubick, Dota 2. Artwork © Valve</div>
    </div>
);

export default Wallpaper;

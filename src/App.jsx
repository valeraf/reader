import { useState } from 'react';
import './App.css'

const App = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [studiedWords, setStudiedWords] = useState(new Set());
  const [showTranslation, setShowTranslation] = useState(false);

  // Словарь сложных слов с переводами и полным грамматическим анализом
  const vocabulary = {
    'venkov': { 
      ru: 'деревня, село', 
      grammar: 'муж. род, им. падеж', 
      note: 'на venkově = в деревне (предл. падеж)',
      comparison: 'В русском: деревня (жен. род), в чешском: venkov (муж. род)'
    },
    'překrásně': { 
      ru: 'прекрасно', 
      grammar: 'наречие, превосходная степень', 
      note: 'от krásný → krásně → překrásně',
      comparison: 'Как в русском: красивый → красиво → прекрасно'
    },
    'žito': { 
      ru: 'рожь', 
      grammar: 'ср. род, им. падеж', 
      note: 'злаковая культура',
      comparison: 'В русском: рожь (жен. род), в чешском: žito (ср. род)'
    },
    'zlátlo': { 
      ru: 'золотилось', 
      grammar: 'глагол, прош. время, ср. род, несов. вид', 
      note: 'от zlátit se (покрываться золотом)',
      comparison: 'Окончание -lo показывает средний род субъекта (žito)'
    },
    'oves': { 
      ru: 'овёс', 
      grammar: 'муж. род, им. падеж', 
      note: 'зерновая культура',
      comparison: 'Одинаково в русском и чешском - мужской род'
    },
    'zelenal': { 
      ru: 'зеленел', 
      grammar: 'глагол, прош. время, муж. род, несов. вид', 
      note: 'от zelenat se',
      comparison: 'Окончание -l показывает мужской род субъекта (oves)'
    },
    'kupkách': { 
      ru: 'в кучках', 
      grammar: 'жен. род, предл. падеж, мн. число', 
      note: 'kupka (кучка) + предлог v',
      comparison: 'v kupkách = в кучках (предлог v требует предложного падежа)'
    },
    'čáp': { 
      ru: 'аист', 
      grammar: 'муж. род, им. падеж', 
      note: 'большая птица',
      comparison: 'Как в русском - мужской род'
    },
    'hovořil': { 
      ru: 'говорил', 
      grammar: 'глагол, прош. время, муж. род, несов. вид', 
      note: 'от hovořit (более формально чем mluvit)',
      comparison: 'Окончание -l = мужской род, как в русском "говорил"'
    },
    'prostíraly': { 
      ru: 'простирались', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'от prostírat se',
      comparison: 'Окончание -ly = множественное число в прошедшем времени'
    },
    'uprostřed': { 
      ru: 'посреди', 
      grammar: 'предлог + наречие', 
      note: 'u- (приставка) + prostřed (середина)',
      comparison: 'Требует родительного падежа: uprostřed lesů (посреди лесов)'
    },
    'jezírka': { 
      ru: 'озерца', 
      grammar: 'ср. род, им. падеж, мн. число', 
      note: 'jezero → jezírko → jezírka',
      comparison: 'Уменьшительная форма как в русском: озеро → озерцо → озерца'
    },
    'sluneční': { 
      ru: 'солнечный', 
      grammar: 'прилагательное, жен. род', 
      note: 'от slunce (солнце) + суффикс -ní',
      comparison: 'Согласуется с záplava (жен. род): sluneční záplava'
    },
    'záplava': { 
      ru: 'поток, обилие', 
      grammar: 'жен. род, им. падеж', 
      note: 'záplava světla = поток света',
      comparison: 'В русском тоже женский род: заплава, наводнение'
    },
    'panský': { 
      ru: 'барский, господский', 
      grammar: 'прилагательное, муж. род', 
      note: 'от pán (господин) + суффикс -ský',
      comparison: 'Согласуется с dvůr (муж. род): panský dvůr'
    },
    'strouhy': { 
      ru: 'канавы, рвы', 
      grammar: 'жен. род, им. падеж, мн. число', 
      note: 'strouhá (канава) во множественном числе',
      comparison: 'Как в русском: канава → канавы'
    },
    'dokola': { 
      ru: 'вокруг', 
      grammar: 'наречие', 
      note: 'do- + kolo (круг) + -a',
      comparison: 'Букв. "в круг" = вокруг'
    },
    'lopuchové': { 
      ru: 'лопуховые', 
      grammar: 'прилагательное, мн. число', 
      note: 'от lopuch (лопух) + суффикс -ový',
      comparison: 'Согласуется с listy (мн. число): lopuchové listy'
    },
    'listy': { 
      ru: 'листья', 
      grammar: 'муж. род, им. падеж, мн. число', 
      note: 'list (лист) во множественном числе',
      comparison: 'В чешском list - муж. род, в русском лист - тоже муж. род'
    },
    'vzpřímené': { 
      ru: 'выпрямившись, прямо', 
      grammar: 'наречие/причастие', 
      note: 'от vzpřímit (выпрямить)',
      comparison: 'stát vzpřímené = стоять выпрямившись'
    },
    'uhnízdila': { 
      ru: 'свила гнездо', 
      grammar: 'глагол, прош. время, жен. род, сов. вид', 
      note: 'u- (приставка) + hnízdit se',
      comparison: 'Окончание -la = женский род субъекта (kachna)'
    },
    'vysedět': { 
      ru: 'высидеть', 
      grammar: 'глагол, инфинитив, сов. вид', 
      note: 'vy- (приставка) + sedět (сидеть)',
      comparison: 'Совершенный вид как в русском: сидеть → высидеть'
    },
    'začínala': { 
      ru: 'начинала', 
      grammar: 'глагол, прош. время, жен. род, несов. вид', 
      note: 'от začínat (несов. вид от začít)',
      comparison: 'Окончание -la = женский род субъекта (kachna)'
    },
    'málokdy': { 
      ru: 'редко', 
      grammar: 'наречие времени', 
      note: 'málo (мало) + kdy (когда)',
      comparison: 'Сложное наречие: мало + когда = редко'
    },
    'proháněly': { 
      ru: 'гонялись, носились', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'pro- + hánět se (гоняться)',
      comparison: 'Окончание -ly = множественное число (ostatní kachny)'
    },
    'štvaly': { 
      ru: 'спешили, торопились', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'от štvát se (торопиться)',
      comparison: 'Окончание -ly = множественное число'
    },
    'kopce': { 
      ru: 'холм', 
      grammar: 'муж. род, род. падеж', 
      note: 'do kopce = в гору, на холм',
      comparison: 'Предлог do требует родительного падежа'
    },
    'vysedávaly': { 
      ru: 'сидели (регулярно)', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'многократный/итеративный глагол от vysedět',
      comparison: 'Показывает повторяющееся действие'
    },
    'štěbetaly': { 
      ru: 'щебетали', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'от štěbetat (щебетать)',
      comparison: 'Окончание -ly = множественное число (kachny)'
    },
    'vajíčko': { 
      ru: 'яичко', 
      grammar: 'ср. род, им. падеж', 
      note: 'vejce → vajíčko (уменьшительное)',
      comparison: 'Уменьшительная форма: яйцо → яичко'
    },
    'pukalo': { 
      ru: 'трескалось, лопалось', 
      grammar: 'глагол, прош. время, ср. род, несов. вид', 
      note: 'от pukat/puknout (лопаться)',
      comparison: 'Окончание -lo согласуется с vajíčko (ср. род)'
    },
    'ozývalo': { 
      ru: 'раздавалось', 
      grammar: 'глагол, прош. время, ср. род, несов. вид', 
      note: 'от ozývat se (раздаваться)',
      comparison: 'Возвратный глагол, как в русском "раздаваться"'
    },
    'žloutky': { 
      ru: 'желтки', 
      grammar: 'муж. род, им. падеж, мн. число', 
      note: 'žloutek (желток) во множественном числе',
      comparison: 'В чешском žloutek - муж. род, в русском желток - тоже муж.'
    },
    'oživly': { 
      ru: 'ожили', 
      grammar: 'глагол, прош. время, мн. число, сов. вид', 
      note: 'от ožít (ожить)',
      comparison: 'Совершенный вид: ожить (что произошло сразу)'
    },
    'vystrkovaly': { 
      ru: 'высовывали', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'vy- (приставка) + strkovat (совать)',
      comparison: 'Многократное действие во множественном числе'
    },
    'hlavičky': { 
      ru: 'головки', 
      grammar: 'жен. род, вин. падеж, мн. число', 
      note: 'hlava → hlavička → hlavičky',
      comparison: 'Уменьшительная форма: голова → головка → головки'
    },
    'pobízela': { 
      ru: 'подгоняла, торопила', 
      grammar: 'глагол, прош. время, жен. род, несов. вид', 
      note: 'от pobízet (подгонять)',
      comparison: 'Окончание -la = женский род субъекта (kačena)'
    },
    'pospíšila': { 
      ru: 'поспешили', 
      grammar: 'глагол, прош. время, мн. число, сов. вид', 
      note: 'от pospíšit si (поспешить)',
      comparison: 'Возвратная форма с si, совершенный вид'
    },
    'rozhlížela': { 
      ru: 'оглядывались', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'roz- (приставка) + hlížet se (смотреть)',
      comparison: 'Возвратный глагол: rozhlížet se'
    },
    'nechala': { 
      ru: 'позволила, оставила', 
      grammar: 'глагол, прош. время, жен. род, сов. вид', 
      note: 'от nechat (позволить, оставить)',
      comparison: 'nechat + инфинитив = позволить что-то делать'
    },
    'prospívá': { 
      ru: 'полезна, идёт на пользу', 
      grammar: 'глагол, наст. время, 3-е лицо ед. ч.', 
      note: 'от prospívat (быть полезным)',
      comparison: 'prospívat + дательный падеж (očím = глазам)'
    },
    'očím': { 
      ru: 'глазам', 
      grammar: 'ср. род, дат. падеж, мн. число', 
      note: 'oko → oči → očím (дательный падеж)',
      comparison: 'После prospívá требуется дательный падеж'
    },
    'divila': { 
      ru: 'удивлялись', 
      grammar: 'глагол, прош. время, мн. число, несов. вид', 
      note: 'от divit se (удивляться)',
      comparison: 'Возвратный глагол + окончание -la (согласование с kačátka)'
    },
    'mnohem': { 
      ru: 'намного, гораздо', 
      grammar: 'наречие степени', 
      note: 'усилительная частица перед сравнительной степенью',
      comparison: 'mnohem víc = намного больше'
    },
    'místa': { 
      ru: 'места', 
      grammar: 'ср. род, род. падеж, ед. число', 
      note: 'místo в родительном падеже после víc',
      comparison: 'víc + родительный падеж = больше чего-то'
    },
    'dokud': { 
      ru: 'пока, до тех пор как', 
      grammar: 'временной союз', 
      note: 'вводит придаточное времени',
      comparison: 'dokud byla zavřená = пока была закрыта'
    },
    'zavřená': { 
      ru: 'закрыты', 
      grammar: 'прич. прош. страд., мн. число', 
      note: 'от zavřít (закрыть)',
      comparison: 'Согласуется с kačátka: byla zavřená'
    },
    'myslíte': { 
      ru: 'думаете', 
      grammar: 'глагол, наст. время, 2-е лицо мн. ч.', 
      note: 'от myslit (думать)',
      comparison: 'Обращение ко множеству: vy myslíte'
    },
    'poučovala': { 
      ru: 'поучала, наставляла', 
      grammar: 'глагол, прош. время, жен. род, несов. вид', 
      note: 'от poučovat (поучать)',
      comparison: 'Окончание -la = женский род (maminka)'
    },
    'táhne': { 
      ru: 'тянется, простирается', 
      grammar: 'глагол, наст. время, 3-е лицо ед. ч.', 
      note: 'от táhnout se (тянуться)',
      comparison: 'svět se táhne = мир тянется/простирается'
    },
    'zahradu': { 
      ru: 'сад', 
      grammar: 'жен. род, вин. падеж', 
      note: 'zahrada в винительном падеже после za',
      comparison: 'za + винительный падеж = за что-то'
    },
    'farářových': { 
      ru: 'священника, церковных', 
      grammar: 'прилагательное, род. падеж, мн. число', 
      note: 'от farář (священник) + притяжательный суффикс',
      comparison: 'farářových polí = поля священника'
    },
    'polí': { 
      ru: 'поля', 
      grammar: 'ср. род, род. падеж, мн. число', 
      note: 'pole во множественном числе, родительный падеж',
      comparison: 'После до требуется родительный падеж'
    },
    'nebyla': { 
      ru: 'не была', 
      grammar: 'глагол být, прош. время, жен. род, отрицание', 
      note: 'ne- + byla',
      comparison: 'Отрицание в прошедшем времени'
    },
    'všichni': { 
      ru: 'все', 
      grammar: 'местоимение, им. падеж, мн. число, одушевл.', 
      note: 'для одушевлённых во множественном числе',
      comparison: 'všichni (одуш.) vs. všechna/všechny (неодуш.)'
    },
    'vstala': { 
      ru: 'встала', 
      grammar: 'глагол, прош. время, жен. род, сов. вид', 
      note: 'от vstát (встать)',
      comparison: 'Совершенный вид: что сделала? встала'
    },
    'hnízda': { 
      ru: 'гнезда', 
      grammar: 'ср. род, род. падеж, ед. число', 
      note: 'hnízdo в родительном падеже после z',
      comparison: 'z + родительный падеж = из чего-то'
    },
    'nejsou': { 
      ru: 'нет, не являются', 
      grammar: 'глагол být, наст. время, 3-е лицо мн. ч., отрицание', 
      note: 'ne- + jsou',
      comparison: 'Отрицательная форма от jsou (являются)'
    },
    'největší': { 
      ru: 'самое большое', 
      grammar: 'прилагательное, превосходная степень, ср. род', 
      note: 'nej- + větší (сравнительная степень)',
      comparison: 'veliký → větší → největší'
    },
    'dosud': { 
      ru: 'до сих пор, всё ещё', 
      grammar: 'наречие времени', 
      note: 'указывает на продолжение до настоящего момента',
      comparison: 'do + sud (этот) = до сих пор'
    },
    'leží': { 
      ru: 'лежит', 
      grammar: 'глагол, наст. время, 3-е лицо ед. ч.', 
      note: 'от ležet (лежать)',
      comparison: 'Состояние: что делает? лежит'
    },
    'dlouho': { 
      ru: 'долго', 
      grammar: 'наречие времени', 
      note: 'указывает на продолжительность действия',
      comparison: 'Сравните: krátce (коротко) ↔ dlouho (долго)'
    },
    'trvat': { 
      ru: 'длиться, продолжаться', 
      grammar: 'глагол несовершенного вида, инфинитив', 
      note: 'Часто используется с временными выражениями',
      comparison: 'trvá (3л.ед.ч.) → trvalo (прош.вр.)'
    },
    'začínám': { 
      ru: 'начинаю', 
      grammar: 'глагол, наст. время, 1-е лицо ед. ч.', 
      note: 'от začínat (начинать)',
      comparison: 'začínat → začínám → začíná (парадигма спряжения)'
    },
    'věru': { 
      ru: 'поистине, действительно', 
      grammar: 'усилительная частица (книжное)', 
      note: 'Устаревший оттенок, усиливает утверждение',
      comparison: 'Синонимы: opravdu, skutečně'
    },
    'dost': { 
      ru: 'довольно, достаточно', 
      grammar: 'наречие меры и степени', 
      note: 'Может использоваться самостоятельно как междометие',
      comparison: 'dostatek (сущ.) → dost (нареч.)'
    },
    'znovu': { 
      ru: 'снова, опять', 
      grammar: 'наречие времени', 
      note: 'Указывает на повторение действия',
      comparison: 'nový (новый) → znovu (снова)'
    },
    'uvelebila': { 
      ru: 'устроилась, умостилась', 
      grammar: 'глагол, прош. время, ж.р. ед.ч.', 
      note: 'от uvelebit se (устроиться с комфортом)',
      comparison: 'velebit (восхвалять) + приставка u- = обустраиваться'
    }
  }
      

  // Разбиваем текст на абзацы
  const storyText = `Na venkově bylo překrásně; bylo léto! Žito zlátlo, oves se zelenal, seno stálo na zelených lukách v kupkách a procházel se tam na svých dlouhých červených nohách čáp a hovořil egyptsky, protože se naučil této řeči od matky. Kolem polí a luk se prostíraly veliké lesy a uprostřed lesů byla hluboká jezírka. Na venkově bylo opravdu překrásně. Uprostřed sluneční záplavy stál starý panský dvůr s hlubokými strouhami kolem dokola, a od jeho zdí až dolů k vodě rostly veliké lopuchové listy — byly tak vysoké, že pod největšími mohly malé děti stát vzpřímené. Byla to divočina jako v nejhustším lese. A právě tam se uhnízdila kachna. Měla vysedět kačátka, ale začínala toho mít skoro dost, protože to trvalo již dlouho a jen málokdy ji přišel někdo navštívit. Ostatní kachny se raději proháněly po strouhách, než aby se štvaly k ní do kopce, vysedávaly pod lopuchami a štěbetaly s ní.

Konečně jedno vajíčko po druhém pukalo a ozývalo se z nich „píp, píp!"

Všechny žloutky oživly a vystrkovaly hlavičky.

„Dli! Dli! Už! Už!" pobízela je kačena a kačátka si tedy pospíšila, jak mohla, a rozhlížela se pod zelenými listy na všechny strany. Maminka je nechala rozhlížet, jak jen chtěly, protože zeleň prospívá očím.

„Jak je ten svět veliký!" divila se všechna kačátka, protože teď měla mnohem víc místa, než dokud byla zavřená ve vajíčku.

„Myslíte si, že tohle je celý svět?" poučovala je maminka. „Svět se táhne ještě daleko za naši zahradu, až do farářových polí! Ale tam jsem nikdy nebyla. — Tak co, jste tu už snad všichni?"

Vstala z hnízda.

„Ba ne, nejsou ještě všichni. Největší vajíčko tu dosud leží. Jak dlouho to ještě bude trvat? Už toho začínám mít věru dost!"

A znovu se uvelebila do hnízda.`;

  const paragraphs = storyText.split('\n\n');

  // Функция для обработки клика по слову
  const handleWordClick = (word, event) => {
    event.preventDefault();
    const cleanWord = word.toLowerCase().replace(/[.,!?";:]/g, '');
    
    if (vocabulary[cleanWord]) {
      setSelectedWord({
        word: cleanWord,
        ...vocabulary[cleanWord],
        position: { x: event.clientX, y: event.clientY }
      });
      
      // Добавляем слово в изученные
      setStudiedWords(prev => new Set([...prev, cleanWord]));
    }
  };

  // Функция для создания кликабельных слов
  const renderClickableText = (text) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?";:]/g, '');
      const isInVocabulary = vocabulary[cleanWord];
      const isStudied = studiedWords.has(cleanWord);
      
      if (isInVocabulary) {
        return (
          <span
            key={index}
            className={`cursor-pointer transition-all duration-200 ${
              isStudied 
                ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
            } px-1 rounded`}
            onClick={(e) => handleWordClick(cleanWord, e)}
            title="Нажмите для перевода"
          >
            {word}
          </span>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-800">
          Škaredé kačátko
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Интерактивное чтение сказки на чешском языке
        </p>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="font-semibold mb-2">Как пользоваться:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <span className="bg-blue-200 px-1 rounded">Синие слова</span> - кликните для перевода</li>
            <li>• <span className="bg-green-200 px-1 rounded">Зелёные слова</span> - уже изучены</li>
            <li>• Изучено слов: <strong>{studiedWords.size}</strong> из {Object.keys(vocabulary).length}</li>
          </ul>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
          </button>
          <button
            onClick={() => setStudiedWords(new Set())}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Сбросить прогресс
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="prose max-w-none">
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="mb-4">
              <p className="text-lg leading-relaxed text-gray-800">
                {renderClickableText(paragraph)}
              </p>
              {showTranslation && (
                <p className="text-sm text-gray-600 mt-2 italic border-l-4 border-blue-200 pl-4">
                  {/* Здесь можно добавить переводы абзацев, если нужно */}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Всплывающий перевод */}
      {selectedWord && (
        <div
          className="fixed z-50 bg-white border-2 border-blue-300 rounded-lg shadow-xl p-4 max-w-sm"
          style={{
            left: Math.min(selectedWord.position.x, window.innerWidth - 250),
            top: Math.max(selectedWord.position.y - 100, 10)
          }}
        >
          <button
            onClick={() => setSelectedWord(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <div className="mb-2">
            <strong className="text-blue-800 text-lg">{selectedWord.word}</strong>
          </div>
          <div className="mb-2">
            <span className="text-gray-700 font-medium">🇷🇺 {selectedWord.ru}</span>
          </div>
          {selectedWord.note && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              💡 {selectedWord.note}
            </div>
          )}
          {selectedWord.grammar && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              🎓 {selectedWord.grammar}
            </div>
          )}
          {selectedWord.comparison && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              👉 {selectedWord.comparison}
            </div>
          )}
        </div>
      )}

      {/* Боковая панель с изученными словами */}
      {studiedWords.size > 0 && (
        <div className="fixed right-4 top-4 bg-white rounded-lg shadow-lg p-4 max-w-xs max-h-80 overflow-y-auto">
          <h4 className="font-semibold mb-2 text-green-800">
            Изученные слова ({studiedWords.size})
          </h4>
          <div className="space-y-1">
            {Array.from(studiedWords).map(word => (
              <div key={word} className="text-sm">
                <strong>{word}</strong> - {vocabulary[word]?.ru}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default App;
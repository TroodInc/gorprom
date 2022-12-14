import styles from './index.module.css'
import Head from 'next/head'

const title = 'Политика обработки персональных данных'
const text = '1. Для целей настоящего документа используются следующие термины:\n' +
  '1.1. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» — юридическое лицо, ' +
  'Ассоциация «Некоммерческое партнерство «Горнопромышленники России»», ' +
  'ИНН 7704200601, КПП 771001001, юридический адрес: 125009, Москва, Дегтярный переулок, ' +
  'дом 9, комната 30, тел.: +74954115336.\n' +
  '1.2. Сайт — принадлежащая НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» веб-страница, ' +
  'функционально предназначенная для обеспечения возможности доступа Пользователей к контенту Сайта ' +
  'на условиях настоящей Политики, информирования Пользователей о мероприятиях НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ». ' +
  'Доступ к Сайту реализуется с использованием сети интернет — gorpromexpo.org.\n' +
  '1.3. Пользователь — дееспособное физическое лицо, использующее функциональные возможности Сайта.\n' +
  '1.4. Данные — информация, которую Пользователи передают НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» ' +
  'в процессе использования Сайта.\n' +
  '1.5. Обработка данных — любое действие (операция) или совокупность действий (операций), ' +
  'совершаемых с использованием средств автоматизации или без использования таких средств с Данными, ' +
  'включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), ' +
  'извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, ' +
  'удаление, уничтожение данных. 1.6. Иные термины, не определенные настоящей Политикой, ' +
  'подлежат толкованию в соответствии с общепринятым в интернет-среде значением.\n' +
  '2. Общие положения:\n' +
  '2.1. Настоящий документ (далее и ранее — «Политика») устанавливает права и обязанности ' +
  'НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» в процессе обработки Данных.\n' +
  '2.2. Настоящая Политика разработана в соответствии с законодательством Российской Федерации, ' +
  'регулирующим отношения в сфере обеспечения безопасности персональных данных, и в соответствии с положением ' +
  'об обработке и защите персональных данных, утвержденном НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ».\n' +
  '2.3. Согласие Пользователя с настоящей Политикой является обязательным условием при заполнении и ' +
  'отправке формы, предусмотренной п. 2.4.1 Политики. При этом Пользователь, не согласный с условиями ' +
  'настоящей Политики, не вправе отправлять заполненную форму.\n' +
  '2.4. Пользователь соглашается с условиями настоящей Политики с момента совпадения следующих событий:\n' +
  '2.4.1. заполнение Пользователем собственных Данных в формах обратной связи, ' +
  'представленных в любом из разделов Сайта;\n' +
  '2.4.2. проставление отметки об ознакомлении с настоящей Политикой и согласии с ней в чекбоксе ' +
  '(графический элемент Сайта, позволяющий Пользователю отмечать согласие и ' +
  'ознакомление с Политикой или не отмечать такового);\n' +
  '2.4.3. отправка формы в адрес НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ», указанной в п. 2.4.1 Политики, ' +
  'путем нажатия кнопок, например, «ОТПРАВИТЬ» или «ОК», данной формы.\n' +
  '2.5. Настоящая Политика может быть изменена НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» в одностороннем порядке ' +
  'в любое время, без получения согласия Пользователя и без его предварительного уведомления. Актуальная редакция ' +
  'настоящей Политики публикуется НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» в сети интернет на странице Сайта. ' +
  'Если НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» прямо не указано иное, новая редакция Политики вступает в силу ' +
  'и становится обязательной для соблюдения Пользователем с момента публикации.\n' +
  '2.6. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» сохраняет право на обработку данных Пользователя в отношении ' +
  'персональных данных Пользователя — до момента получения соответствующего уведомления Пользователя; ' +
  'в отношении иных данных — до момента, определенного применимым законодательством.\n' +
  '3. Данные:\n' +
  '3.1. Данные включают в себя информацию, которую Пользователи передают НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» ' +
  'в процессе использования Сайта, как это описано в Политике, и включают в себя как обезличенные ' +
  'пользовательские данные, так и персональные данные Пользователей.\n' +
  '3.2. Данные собираются для целей сотрудничества Пользователя и НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ», ' +
  'а также повышения качества услуг НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» и улучшения Сайта. ' +
  'В частности, целями обработки Данных являются:\n' +
  '3.2.1. осуществление и/или исполнение функций, полномочий и обязанностей, возложенных ' +
  'законодательством Российской Федерации на НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ»;\n' +
  '3.2.2. идентификация Пользователей на Сайте;\n' +
  '3.2.3. предоставление Пользователям актуальной информации о Сайте и возможности доступа к нему;\n' +
  '3.2.4. обработка запросов Пользователей НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ»;\n' +
  '3.2.5. предотвращение и выявление мошенничества и незаконного использования Сайта, услуг Сайта;\n' +
  '3.2.6. предоставление Пользователям персонализированных предложений и рекомендаций;\n' +
  '3.2.7. направление Пользователям служебной, рекламной и иной информации, относящейся к использованию Сайта.\n' +
  '3.3. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ», получив доступ к Данным, обязан не раскрывать третьим лицам ' +
  'и не распространять персональные данные без согласия субъекта персональных данных, ' +
  'если иное не предусмотрено федеральным законом.\n' +
  '3.4. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» вправе поручить обработку Данных другому лицу на основании заключаемого ' +
  'с этим лицом договора, Пользователь выражает свое согласие на реализацию данного права ' +
  'НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ».\n' +
  '3.5. В процессе использования Сайта Пользователями могут быть переданы ' +
  'НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» следующие Данные:\n' +
  '3.5.1. имя и/ или фамилия Пользователя;\n' +
  '3.5.2. адрес электронной почты Пользователя;\n' +
  '3.5.3. телефонный номер Пользователя;\n' +
  '3.5.4. информация о деятельности Пользователя и/или его предпринимательской деятельности;\n' +
  '3.5.5. информация о предпочтениях Пользователя при сотрудничестве с НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ»;\n' +
  '3.5.6. информация о финансовых ожиданиях при сотрудничестве с НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ».\n' +
  '4. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» придерживается следующих принципов обработки Данных:\n' +
  '4.1. обработка персональных данных должна осуществляться на законной и справедливой основе;\n' +
  '4.2. обработка персональных данных должна ограничиваться достижением конкретных, ' +
  'заранее определенных и законных целей;\n' +
  '4.3. не допускается обработка персональных данных, несовместимая с целями сбора персональных данных;\n' +
  '4.4. не допускается объединение баз данных, содержащих персональные данные, ' +
  'обработка которых осуществляется в целях, несовместимых между собой;\n' +
  '4.5. обработке подлежат только персональные данные, которые отвечают целям их обработки;\n' +
  '4.6. содержание и объем обрабатываемых персональных данных должны соответствовать заявленным целям обработки. ' +
  'Обрабатываемые персональные данные не должны быть избыточными по отношению к заявленным целям их обработки;\n' +
  '4.7. при обработке персональных данных должны быть обеспечены точность персональных данных, их достаточность, ' +
  'а в необходимых случаях и актуальность по отношению к целям обработки персональных данных. НП ' +
  '«ГОРНОПРОМЫШЛЕННИКИ РОССИИ» принимает необходимые меры по удалению или уточнению неполных или неточных данных.\n' +
  '4.8. хранение персональных данных должно осуществляться в форме, позволяющей определить субъекта ' +
  'персональных данных, не дольше, чем этого требуют цели обработки персональных данных, если срок хранения ' +
  'персональных данных не установлен федеральным законом, договором, стороной которого, выгодоприобретателем ' +
  'или поручителем по которому является субъект персональных данных; обрабатываемые персональные данные ' +
  'подлежат уничтожению либо обезличиванию по достижении целей обработки или в случае утраты необходимости ' +
  'в достижении этих целей, если иное не предусмотрено федеральным законом;\n' +
  '4.9. обработка персональных данных должна осуществляется таким образом, чтобы в отношении каждой категории ' +
  'персональных данных можно было определить места хранения (материальных носителей) и установить перечень лиц, ' +
  'осуществляющих обработку персональных данных, либо имеющих доступ к ним.\n' +
  '5. Основанием обработки Данных для НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» являются:\n' +
  '5.1. требования настоящей Политики;\n' +
  '5.2. согласие субъекта персональных данных на обработку его персональных данных;\n' +
  '5.3. статистические или иные исследовательские цели, при условии обязательного обезличивания персональных ' +
  'данных и других нормативных правовых актов, регулирующих отношения в сфере обеспечения безопасности ' +
  'персональных данных;\n' +
  '5.4. иные основания, прямо предусмотренные законодательством Российской Федерации.\n' +
  '6. Права Пользователя в сфере обработки Данных:\n' +
  '6.1. Пользователь вправе требовать от НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» уточнения своих персональных данных, ' +
  'их блокирования или уничтожения в случаях, если персональные данные являются неполными, устаревшими, неточными, ' +
  'незаконно полученными или не являются необходимыми для заявленной цели обработки, а также принимать ' +
  'предусмотренные законом меры по защите своих прав.\n' +
  '6.2. Реализация указанных в настоящем разделе требований Пользователя лишает НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» ' +
  'возможности обеспечить полноценное использование Пользователем Сайта.\n' +
  '7. Общие требования к операциям обработки Данных:\n' +
  '7.1. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» может получать персональные данные субъектов следующими способами:\n' +
  '7.1.1. от Пользователя;\n' +
  '7.1.2. из общедоступных источников персональных данных;\n' +
  '7.1.3. от оператора персональных данных, как лицо, осуществляющего обработку персональных данных на ' +
  'основании договора (по поручению оператора с согласия субъекта);\n' +
  '7.1.4. иными законными способами.\n' +
  '7.2. При сборе персональных данных НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» обязан предоставить субъекту по его просьбе ' +
  'информацию, предусмотренную федеральным законом:\n' +
  '7.2.1. подтверждение факта обработки персональных данных оператором;\n' +
  '7.2.2. правовые основания и цели обработки персональных данных;\n' +
  '7.2.3. цели и применяемые способы обработки персональных данных;\n' +
  '7.2.4. наименование и место нахождения НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ», сведения о лицах (за исключением ' +
  'работников НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ»), которые имеют доступ к персональным данным или которым могут ' +
  'быть раскрыты персональные данные на основании договора с НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» или на ' +
  'основании федерального закона;\n' +
  '7.2.5. обрабатываемые персональные данные, относящиеся к соответствующему субъекту персональных данных, ' +
  'источник их получения, если иной порядок представления таких данных не предусмотрен федеральным законом;\n' +
  '7.2.6. сроки обработки персональных данных, в том числе сроки их хранения;\n' +
  '7.2.7. порядок осуществления субъектом персональных данных прав, предусмотренных федеральным законом;\n' +
  '7.2.8. информацию об осуществленной или о предполагаемой трансграничной передаче данных;\n' +
  '7.2.9. наименование или фамилию, имя, отчество и адрес лица, осуществляющего обработку персональных данных ' +
  'по поручению НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ», если обработка поручена или будет поручена такому лицу;\n' +
  '7.2.10. иные сведения, предусмотренные федеральным законодательством.\n' +
  '7.3. Если предоставление персональных данных является обязательным в соответствии с федеральным законом, ' +
  'НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» обязан разъяснить субъекту юридические последствия отказа предоставить ' +
  'его персональные данные.\n' +
  '7.4. При сборе персональных данных, в том числе посредством информационно телекоммуникационной сети «Интернет», ' +
  'НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» обязан обеспечить обработку персональных данных граждан Российской Федерации ' +
  'с использованием баз данных, находящихся на территории Российской Федерации, если иное не предусмотрено ' +
  'федеральным законом.\n' +
  '7.5. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» не осуществляет сбор и последующую обработку специальных категорий ' +
  'персональных данных за исключением следующих случаев:\n' +
  '7.5.1. субъект дал согласие в письменной форме на обработку своих персональных данных;\n' +
  '7.5.2. персональные данные сделаны общедоступными субъектом;\n' +
  '7.5.3. обработка персональных данных осуществляется в соответствии с законодательством о государственной ' +
  'социальной помощи, трудовым законодательством, пенсионным законодательством Российской Федерации;\n' +
  '7.5.4. обработка персональных данных необходима для защиты жизни, здоровья или иных жизненно важных ' +
  'интересов субъекта либо жизни, здоровья или иных жизненно важных интересов других лиц и получение ' +
  'согласия субъекта невозможно;\n' +
  '7.5.5. обработка персональных данных необходима для установления или осуществления прав субъекта или ' +
  'третьих лиц, а равно и в связи с осуществлением правосудия;\n' +
  '7.5.6. обработка персональных данных осуществляется в соответствии с законодательством об обязательных ' +
  'видах страхования, со страховым законодательством.\n' +
  '7.6. Согласие субъекта на обработку персональных данных должно быть получено строго до начала ' +
  'обработки персональных данных.\n' +
  '8. Хранение Данных:\n' +
  '8.1. Режим конфиденциальности в отношении Данных снимается:\n' +
  '8.1.1. в случае их обезличивания;\n' +
  '8.1.2. по истечении 75 лет срока их хранения;\n' +
  '8.1.3. в других случаях, предусмотренных федеральными законами РФ.\n' +
  '8.2. Конфиденциальность персональных данных устанавливается на основании действующих ' +
  'требований федерального закона РФ.\n' +
  '9. Передача Данных третьим лицам:\n' +
  '9.1. НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» вправе поручить обработку Данных другому лицу с соблюдением ' +
  'требований законодательства;\n' +
  '9.2. трансграничная передача данных на территории иностранных государств может осуществляться ' +
  'НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ» для целей исполнения цели обработки персональных данных.\n' +
  '10. Для обеспечения защиты от несанкционированного доступа к Данным в НП «ГОРНОПРОМЫШЛЕННИКИ РОССИИ»:\n' +
  '10.1. назначаются ответственные за обеспечение безопасности данных;\n' +
  '10.2. создается система защиты данных, включающая:\n' +
  '10.2.1. организационные меры по обеспечению безопасности данных;\n' +
  '10.2.2. технические меры по обеспечению безопасности данных.\n' +
  '11. Данные подлежат уничтожению либо обезличиванию:\n' +
  '11.1. по достижении целей обработки или в случае утраты необходимости в достижении этих целей, ' +
  'если иное не предусмотрено федеральным законом;\n' +
  '11.2. по истечению установленного срока обработки персональных данных;\n' +
  '11.3. в случае обращения субъекта персональных данных или Уполномоченного органа по ' +
  'защите прав субъектов персональных данных. Редакция Политики, действующая с «1» августа 2022 г. ' +
  'Мы используем файлы cookie. Посещая наш сайт, вы принимаете наши условия.'

const Personal = () => {
  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | {title}</title>
      </Head>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.text}>
        {text?.split('\n').map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>
    </div>
  )
}

export default Personal

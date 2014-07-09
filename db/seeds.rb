# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

[
  'ІНШЕ',
  'Квартири',
  'Кімнати в квартирі',
  'Гуртожиток',
  'Готелі',
  'Будинки садибні',
  'Будинки літні',
  'Бази відпочинку',
  'Санаторії',
  'Табори'
].each do |name|
  House.create(:name => name) if House.where( :name => name ).empty?
end


# -----------------------------------

[{:area=>"26", :name=>"ІВАНО-ФРАНКІВСЬКА ОБЛАСТЬ/М.ІВАНО-ФРАНКІВСЬК"},
 {:area=>"01", :name=>"АВТОНОМНА РЕСПУБЛІКА КРИМ/М.СІМФЕРОПОЛЬ"},
 {:area=>"05", :name=>"ВІННИЦЬКА ОБЛАСТЬ/М.ВІННИЦЯ"},
 {:area=>"07", :name=>"ВОЛИНСЬКА ОБЛАСТЬ/М.ЛУЦЬК"},
 {:area=>"12", :name=>"ДНІПРОПЕТРОВСЬКА ОБЛАСТЬ/М.ДНІПРОПЕТРОВСЬК"},
 {:area=>"14", :name=>"ДОНЕЦЬКА ОБЛАСТЬ/М.ДОНЕЦЬК"},
 {:area=>"18", :name=>"ЖИТОМИРСЬКА ОБЛАСТЬ/М.ЖИТОМИР"},
 {:area=>"21", :name=>"ЗАКАРПАТСЬКА ОБЛАСТЬ/М.УЖГОРОД"},
 {:area=>"23", :name=>"ЗАПОРІЗЬКА ОБЛАСТЬ/М.ЗАПОРІЖЖЯ"},
 {:area=>"35", :name=>"КІРОВОГРАДСЬКА ОБЛАСТЬ/М.КІРОВОГРАД"},
 {:area=>"32", :name=>"КИЇВСЬКА ОБЛАСТЬ/М.КИЇВ"},
 {:area=>"44", :name=>"ЛУГАНСЬКА ОБЛАСТЬ/М.ЛУГАНСЬК"},
 {:area=>"46", :name=>"ЛЬВІВСЬКА ОБЛАСТЬ/М.ЛЬВІВ"},
 {:area=>"80", :name=>"М.КИЇВ"},
 {:area=>"85", :name=>"М.СЕВАСТОПОЛЬ"},
 {:area=>"48", :name=>"МИКОЛАЇВСЬКА ОБЛАСТЬ/М.МИКОЛАЇВ"},
 {:area=>"51", :name=>"ОДЕСЬКА ОБЛАСТЬ/М.ОДЕСА"},
 {:area=>"53", :name=>"ПОЛТАВСЬКА ОБЛАСТЬ/М.ПОЛТАВА"},
 {:area=>"56", :name=>"РІВНЕНСЬКА ОБЛАСТЬ/М.РІВНЕ"},
 {:area=>"59", :name=>"СУМСЬКА ОБЛАСТЬ/М.СУМИ"},
 {:area=>"61", :name=>"ТЕРНОПІЛЬСЬКА ОБЛАСТЬ/М.ТЕРНОПІЛЬ"},
 {:area=>"63", :name=>"ХАРКІВСЬКА ОБЛАСТЬ/М.ХАРКІВ"},
 {:area=>"65", :name=>"ХЕРСОНСЬКА ОБЛАСТЬ/М.ХЕРСОН"},
 {:area=>"68", :name=>"ХМЕЛЬНИЦЬКА ОБЛАСТЬ/М.ХМЕЛЬНИЦЬКИЙ"},
 {:area=>"71", :name=>"ЧЕРКАСЬКА ОБЛАСТЬ/М.ЧЕРКАСИ"},
 {:area=>"73", :name=>"ЧЕРНІВЕЦЬКА ОБЛАСТЬ/М.ЧЕРНІВЦІ"},
 {:area=>"74", :name=>"ЧЕРНІГІВСЬКА ОБЛАСТЬ/М.ЧЕРНІГІВ"}].each do |item|

  email = "oda#{item[:area]}@gov.ua"

  pass = Random.new.rand(100000..999999)
  Rails.logger.info "!!! pwd=#{pass} #{email}"
  User.create!({:email => email,
                :password => pass,
                :password_confirmation => pass,
                :area => item[:area] }) if User.where( :email => email ).empty?
end

un = User.create({:email => 'news@gov.ua',
              :password => '7-YjDbYb+',
              :password_confirmation => '7-YjDbYb+' }) if User.where( :email => 'news@gov.ua' ).empty?
un.roles <<= :admin
un.save


User.all.each { |u| u.roles = u.roles << :editor; u.save }


ua = User.create({:email => 'begemot.lery@mail.ru',
             :password => ',tutvjn',
             :password_confirmation => ',tutvjn', :area => "05" } )
ua.roles = :admin
ua.save


news = [
    {
        :href => "http://www.mns.gov.ua/news/34232.html",
        :text => "ІНФОРМАЦІЯ ПРО ПЕРЕМІЩЕННЯ ГРОМАДЯН З РАЙОНІВ ПРОВЕДЕННЯ АТО"
    },
    {
        :date => "08.07.2014",
        :href => "http://www.mns.gov.ua/news/34457.html",
        :text => "Українські рятувальники допомагають відновлювати системи життєзабезпечення у містах Слов’янськ та Краматорськ"
    },
    {
        :date => "07.07.2014",
        :href => "http://www.kmu.gov.ua/control/uk/publish/article?art_id=247433448",
        :text => "Володимир Гройсман поставив чіткі завдання з організації мирного коридору Міжвідомчому координаційному штабу"
    },
    {
        :date => "06.07.2014",
        :href => "http://www.mns.gov.ua/news/34448.html",
        :text => "Рятувальники доставили мешканцям слов`янська гуманітарну допомогу"
    },
    {
        :date => "05.07.2014",
        :href => "http://www.mns.gov.ua/news/34443.html",
        :text => "З роботою Міжвідомчого координаційного штабу з питань соціального забезпечення громадян України, які переміщуються з районів проведення антитерористичної операції ознайомився голова Донецької ОДА Сергій Тарута"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34439.html",
        :text => "Міжвідомчий координаційний штаб з’ясовував проблемні питання, пов’язані з наданням допомоги громадянам, які тимчасово переміщуються з зони АТО"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34437.html",
        :text => "Одеса: рятувальники спільно з волонтерами зустріли дітей та інвалідів з Донецької області (ВІДЕО)"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34436.html",

        :text => "Миколаївська область: психологи ДСНС проводять тренінги з дітьми, які прибули до Миколаївщини з Донецької та Луганської областей"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34430.html",
        :text => "Рівне: під час прямого ефіру на місцевому телеканалі, учасники обласного штабу розповіли про соціальне забезпечення громадян України, які переміщуються з районів проведення АТО"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34422.html",
        :text => "Київська область: рятувальники здали понад 30 л крові для українських військових"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34421.html",
        :text => "Чернівецька область: психологи надають допомогу людям, які переселилися зі східних регіонів країни"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34418.html",
        :text => "Рівненська область: рятувальники та соцпрацівники зустрілися з дітьми та сім’ями переселенців"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34416.html",
        :text => "Волинська область: рятувальники допомогли зустріти та розмістити громадян, які виїхали зі Сходу"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34415.html",
        :text => "Хмельницький: рятувальники допомогли тимчасовим переселенцям"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34414.html",
        :text => "Львів: представники ООН, Міністра соціальної політики України та рятувальники відвідали маленьких луганчан (ВІДЕО)"
    },
    {
        :date => "04.07.2014",
        :href => "http://www.mns.gov.ua/news/34410.html",
        :text => "Київ: рятувальники провели для дітей з Донецька екскурсію по столиці"
    },
    {
        :date => "03.07.2014",
        :href => "http://www.mns.gov.ua/news/34405.html",
        :text => "Київська область: рятувальники допомагають родинам переселенців адаптуватися до мирного життя (ВІДЕО)"
    },
    {
        :text => "УВАГА. До 03 липня ресурс знаходиться в стані тестової експлуатації та наповнення інформацією. В разі виникнення питань або пропозицій - прохання звертатись листом на адресу support@minregion.gov.ua"
    },
    {
        :date => "25.06.2014",
        :href => "http://minregion.gov.ua/news/proekt-zmin-do-konstituciyi-schodo-decentralizaciyi-vladi-verhovna-rada-mozhe-priynyati-vzhe-nastupnogo-tizhnya---prezident-ukra-748153/",
        :text => "Проект змін до Конституції щодо децентралізації влади Верховна Рада може прийняти вже наступного тижня, - Президент України"
    },
    {
        :date => "25.06.2014",
        :href => "http://minregion.gov.ua/news/mi-maemo-stovidsotkovu-pidtrimku-reformi-miscevogo-samovryaduvannya-prezidentom-premerom-ta-uryadom--volodimir-groysman-167734/",
        :text => "Ми маємо стовідсоткову підтримку реформи місцевого самоврядування Президентом, Прем’єром та Урядом, – Володимир Гройсман"
    }
].reverse.each { |item|
  NewsItem.find_or_create_by(url: item[:href], content: item[:text]).update(issued: item[:date])
}

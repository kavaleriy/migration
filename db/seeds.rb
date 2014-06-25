# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

[
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
User.delete_all

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
  User.create!({:email => email,
                :password => "1",
                :password_confirmation => "1",
                :area => item[:area] }) if User.where( :email => email ).empty?
end

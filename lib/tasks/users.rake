#encoding: utf-8

namespace :users do

  desc "users"
  task :seed => :environment do

    User.delete_all
    [
      {:area=>"26", :pass=>"863382", :name=>"ІВАНО-ФРАНКІВСЬКА ОБЛАСТЬ/М.ІВАНО-ФРАНКІВСЬК"},
      {:area=>"01", :pass=>"352581", :name=>"АВТОНОМНА РЕСПУБЛІКА КРИМ/М.СІМФЕРОПОЛЬ"},
      {:area=>"05", :pass=>"589012", :name=>"ВІННИЦЬКА ОБЛАСТЬ/М.ВІННИЦЯ"},
      {:area=>"07", :pass=>"451983", :name=>"ВОЛИНСЬКА ОБЛАСТЬ/М.ЛУЦЬК"},
      {:area=>"12", :pass=>"107074", :name=>"ДНІПРОПЕТРОВСЬКА ОБЛАСТЬ/М.ДНІПРОПЕТРОВСЬК"},
      {:area=>"14", :pass=>"159913", :name=>"ДОНЕЦЬКА ОБЛАСТЬ/М.ДОНЕЦЬК"},
      {:area=>"18", :pass=>"840863", :name=>"ЖИТОМИРСЬКА ОБЛАСТЬ/М.ЖИТОМИР"},
      {:area=>"21", :pass=>"922597", :name=>"ЗАКАРПАТСЬКА ОБЛАСТЬ/М.УЖГОРОД"},
      {:area=>"23", :pass=>"795448", :name=>"ЗАПОРІЗЬКА ОБЛАСТЬ/М.ЗАПОРІЖЖЯ"},
      {:area=>"35", :pass=>"538625", :name=>"КІРОВОГРАДСЬКА ОБЛАСТЬ/М.КІРОВОГРАД"},
      {:area=>"32", :pass=>"691746", :name=>"КИЇВСЬКА ОБЛАСТЬ/М.КИЇВ"},
      {:area=>"44", :pass=>"767463", :name=>"ЛУГАНСЬКА ОБЛАСТЬ/М.ЛУГАНСЬК"},
      {:area=>"46", :pass=>"699004", :name=>"ЛЬВІВСЬКА ОБЛАСТЬ/М.ЛЬВІВ"},
      {:area=>"80", :pass=>"507045", :name=>"М.КИЇВ"},
      {:area=>"85", :pass=>"796694", :name=>"М.СЕВАСТОПОЛЬ"},
      {:area=>"48", :pass=>"885067", :name=>"МИКОЛАЇВСЬКА ОБЛАСТЬ/М.МИКОЛАЇВ"},
      {:area=>"51", :pass=>"123096", :name=>"ОДЕСЬКА ОБЛАСТЬ/М.ОДЕСА"},
      {:area=>"53", :pass=>"887451", :name=>"ПОЛТАВСЬКА ОБЛАСТЬ/М.ПОЛТАВА"},
      {:area=>"56", :pass=>"239614", :name=>"РІВНЕНСЬКА ОБЛАСТЬ/М.РІВНЕ"},
      {:area=>"59", :pass=>"129489", :name=>"СУМСЬКА ОБЛАСТЬ/М.СУМИ"},
      {:area=>"61", :pass=>"745144", :name=>"ТЕРНОПІЛЬСЬКА ОБЛАСТЬ/М.ТЕРНОПІЛЬ"},
      {:area=>"63", :pass=>"902063", :name=>"ХАРКІВСЬКА ОБЛАСТЬ/М.ХАРКІВ"},
      {:area=>"65", :pass=>"383381", :name=>"ХЕРСОНСЬКА ОБЛАСТЬ/М.ХЕРСОН"},
      {:area=>"68", :pass=>"462569", :name=>"ХМЕЛЬНИЦЬКА ОБЛАСТЬ/М.ХМЕЛЬНИЦЬКИЙ"},
      {:area=>"71", :pass=>"767866", :name=>"ЧЕРКАСЬКА ОБЛАСТЬ/М.ЧЕРКАСИ"},
      {:area=>"73", :pass=>"839644", :name=>"ЧЕРНІВЕЦЬКА ОБЛАСТЬ/М.ЧЕРНІВЦІ"},
      {:area=>"74", :pass=>"126510", :name=>"ЧЕРНІГІВСЬКА ОБЛАСТЬ/М.ЧЕРНІГІВ"}
    ].each do |item|
      email = "oda#{item[:area]}@gov.ua"
      pass = item[:pass]
      User.create!({:email => email,
                :password => pass,
                :password_confirmation => pass,
                :area => item[:area] })
    end
  end

end
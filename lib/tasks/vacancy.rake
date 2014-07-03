#encoding: utf-8

namespace :vacancies do

  desc "Load koatuus to trud codes"
  task :koatuus=> :environment do
    TrudGov.destroy_all

    Koatuu.areas.each { |area|
      area_code = area.code.slice(0,2)
      create_trud area_code

      (Koatuu.acities(area_code) + Koatuu.regions(area_code)).each {|region|
        create_trud region.code.slice(0,5)
      }
    }
  end

  private
    def create_trud(code)
      TrudGov.create({ :koatuu_code => code }) if TrudGov.where( :koatuu_code => code ).empty?
    end



  desc "Load data "
  task :seed => :environment do

    vac = JSON.parse(File.open("db/spr/vacancies.json", "r").read)
    data = parse_data vac

    Workplace.destroy_all

    data.each { |item|
      trud_code = item[:code]
      koatuu_code = find_koatuu(trud_code)
      if koatuu_code
        cnt = item[:count]
        rubric = item[:rubric]
        wp = Workplace.find_or_create_by(:koatuu_code => koatuu_code, :rubric => rubric)
        wp.update({ :places => cnt, :trud_code => trud_code })
        wp.save
      end
    }

  end

  private
    def self.parse_data vac
      res = get_collection(vac)
      res.collect { |v|
        get_collection(v['rubrics']).collect { |r|
          { code: v['code'], rubric: r['code'], count: r['count'] }
        }
      }.flatten
    end

    def get_collection obj
      obj.reject {|v| v['count'] == '' }
    end

    def find_koatuu trud_code
      a = {
          '7904431984' => '8000000000', #  м. Київ
          '7904441900' => '8500000000', #  м. Севастополь
          '7900244401' => '0100000000', #  Автономна Республіка Крим
          '7900244430' => '0500000000', #  Вінницька область
          '7900244460' => '0700000000', #  Волинська область
          '7900244479' => '1200000000', #  Дніпропетровська область
          '7906156000' => '1400000000', #  Донецька область
          '7900949503' => '1800000000', #  Житомирська область
          '7906156069' => '2100000000', #  Закарпатська область
          '7906156085' => '2300000000', #  Запорізька область
          '7906163117' => '2600000000', #  Івано-Франківська область
          '7903982200' => '3200000000', #  Київська область
          '7903982232' => '3500000000', #  Кіровоградська область
          '7904311500' => '4400000000', #  Луганська область
          '7904337804' => '4600000000', #  Львівська область
          '7904339601' => '4800000000', #  Миколаївська область
          '7904339626' => '5100000000', #  Одеська область
          '7904374137' => '5300000000', #  Полтавська область
          '7904374165' => '5600000000', #  Рівненська область
          '7904374186' => '5900000000', #  Сумська область
          '7904398806' => '6100000000', #  Тернопільська область
          '7904398824' => '6300000000', #  Харківська область
          '7904427012' => '6500000000', #  Херсонська область
          '7904429921' => '6800000000', #  Хмельницька область
          '7904431921' => '7100000000', #  Черкаська область
          '7904431945' => '7300000000', #  Чернівецька область
          '7904431958' => '7400000000'  #  Чернігівська область

      }[trud_code]
    end


end

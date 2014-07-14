#encoding: utf-8

namespace :koatuu do

  desc "Load KOATUU from file"
  task :load => :environment do

    require 'roo'

    xls = Roo::Excelx.new("config/koatuu_01042014.xlsx")
    xls.default_sheet = xls.sheets.first

    2.upto(xls.last_row) do |line|
      code = xls.cell(line,'A').to_s.gsub('.0', '').rjust(10, '0')
      note = xls.cell(line,'B') || ''
      name = extract_name (xls.cell(line,'C')) || ''

      b3 = code[2]
      b6 = code[5]

      if b3 == '0' and b6 == '0'
        level = 1
      elsif b3.index(/[23]/) and b6 == '0' and code.match(/.0000000/).nil?
        level = 2
      elsif code.index('10100000')
        level = 13 # head of area
      elsif note.index(/[М]/)
        level = 3
      elsif note.index(/[Т]/)
        level = 31
      end

      koatuu = Koatuu.find_or_create_by(:code => code).
          update({ name: name, note: note, level: level })
    end

    # postfix
    Koatuu.delete_all("code like '01%'")
    Koatuu.delete_all(:code => '8500000000') # simferopol
    Koatuu.where(:code => '8000000000').first.update( { :level => 1} ) # kyiv


    Koatuu.where(:code => ['1210400000', '1211000000', '1410600000', '1412300000', '1413500000']).update_all( {:level => 2 } )

  end


    private
    def self.extract_name name
      index = name.index('/')
      name = name.slice(0, index) if index
      if /^М\./ =~ name
        name = 'м.' + $'.mb_chars.capitalize
      else
        name.mb_chars.capitalize
      end
      # name.mb_chars.gsub(/ ОБЛАСТЬ$/, '').gsub(/ РАЙОН$/, '').capitalize
    end


  # =====================================================================================================
  desc "Import geo-data from json"
  task :load_geo => :environment do
    geo = JSON.parse(File.open("db/spr/geo.json", "r").read)

    Geo.destroy_all

    geo.each { |area|
      extract_geo area
      regions = area['rayon']

      regions.each { |region|
        extract_geo region
      }
    }
  end

    private
      def extract_geo data

        koatuu_code = data['code']
        lon = data['geo']['lon']
        lat = data['geo']['lat']
        zoom = data['geo']['zoom']

        Geo.create({ koatuu_code: koatuu_code, lon: lon, lat: lat, zoom: zoom }).save
      end

  # =====================================================================================================
  desc "Load koatuus to trud codes"
  task :export_trud => :environment do
    Koatuu.l2.each {|region|
      TrudGov.find_or_create_by(:koatuu_code => region.code).save
    }
  end


end

#encoding: utf-8

namespace :koatuu do

  desc "Load KOATUU from file"
  task :seed => :environment do

    require 'roo'

    xls = Roo::Excelx.new("config/koatuu_01042014.xlsx")
    xls.default_sheet = xls.sheets.first

    Koatuu.destroy_all

    2.upto(xls.last_row) do |line|
      code = xls.cell(line,'A').to_s.gsub('.0', '').rjust(10, '0')
      note = xls.cell(line,'B')
      name = xls.cell(line,'C')

      b3 = code[2]
      b6 = code[5]

      rec = Koatuu.create({ code: code, name: name, note: note, b3: b3, b6: b6 })
      rec.save
    end
  end

end

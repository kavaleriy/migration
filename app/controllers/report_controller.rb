class ReportController < ApplicationController
  def amount_places
    @dt = Date.current
    @rep = Koatuu.areas.collect { |area|
      code_area = area.code.slice(0, 2)

      qtt_regions = (Koatuu.acities(code_area) + Koatuu.regions(code_area)).collect { |region|
        code_region = region.code.slice(0, 5)
        { code: code_region, name: region.name, qtt: Housing.group_qtt(code_region)}
      }.reject{ |item| item[:qtt] == 0 }

      qtt = Housing.group_qtt(code_area)
      { code: code_area, name: area.name, qtt: qtt, regions: qtt_regions}
    }.reject{ |item| item[:qtt] == 0 }
  end

  def amount_by_type
    @dt = Date.current

    @rep = Koatuu.areas.collect { |area|
      area_code = area.code.slice(0, 2)
      houses = House.all.collect { |house|
        { name: house.name, qtt: Housing.group_by_house(area_code, house.id)}
      }.reject{ |item| item[:qtt] == 0 }

      qtt = Housing.group_qtt(area_code)
      { code: area_code, name: area.name, qtt: qtt, houses: houses}
    }.reject{ |item| item[:qtt] == 0 }


  end

  def amount_of_job
  end
end

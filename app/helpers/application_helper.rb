module ApplicationHelper
  def paginate(collection, params= {})
    will_paginate collection, params.merge(:renderer => RemoteLinkPaginationHelper::LinkRenderer)
  end

  def school_class(val)
    'fa fa-check-square-o' if Housing.has_school?(val)
  end
  def kgarten_class(val)
    'fa fa-check-square-o' if Housing.has_kgarten?(val)
  end

  def work_class(koatuu_code)
    rubric = params[:home_search_rubric]
    return unless rubric
    area_code = koatuu_code.slice(0,2)
    region_code = koatuu_code.slice(0,5)
    # wp = Workplace.where(:koatuu_code => koatuu_code, :rubric => rubric).first
    wp_area = TrudGov.where(:koatuu_code => area_code).where.not(:trud_code => '').first
    unless wp_area.nil?
      reg_id = wp_area.trud_code
      wp_region = TrudGov.where(:koatuu_code => region_code).where.not(:trud_code => '')
      distr_id = wp_region.first.trud_code unless wp_region.empty?
      # "http://www.trud.gov.ua/control/uk/index#rubId=#{rubric}&posId=&regId=#{reg_id}&distrId=#{distr_id}&typeSearch=1&startPos=1&page=0"
      "http://www.trud.gov.ua/control/uk/index#rubId=#{rubric}&posId=&regId=#{reg_id}&typeSearch=1&startPos=1&browser_name=Netscape&page=0"
    end
  end

end

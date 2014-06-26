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
    wp = Workplace.where(:koatuu_code => Koatuu.area(koatuu_code).code, :rubric => rubric)
    if wp.any?
      reg_id = wp.first.trud_code
      "http://www.trud.gov.ua/control/uk/index#rubId=#{rubric}&posId=&regId=#{reg_id}&typeSearch=1&startPos=1&page=0"
    end
  end

end

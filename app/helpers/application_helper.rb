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
    rubric = params[:home_search_rubric] || '0'

    wp = Workplace.where(:koatuu_code => Koatuu.area(koatuu_code).code, :rubric => rubric)
    'fa fa-check' if wp.any?
  end

end

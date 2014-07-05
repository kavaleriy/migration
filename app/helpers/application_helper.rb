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
    return '-' unless rubric

    wp = Workplace.where(:koatuu_code => koatuu_code, :rubric => rubric).first
    # wp_area = TrudGov.where(:koatuu_code => koatuu_code.slice(0,2).ljust(10, '0')).first

    places = wp.places if wp

    places || '-'
  end

end

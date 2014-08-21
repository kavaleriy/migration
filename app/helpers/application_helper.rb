module ApplicationHelper
  def paginate(collection, params= {})
    will_paginate collection, params.merge(:renderer => RemoteLinkPaginationHelper::LinkRenderer)
  end

  def school_class(val)
    cl = Housing.has_school?(val) ? 'fa fa-check-square-o' : 'fa fa-square-o'
    color = Housing.has_school?(val) ? 'green' : 'lightgrey'
    { :class => cl, :color => color }
  end
  def kgarten_class(val)
    cl = Housing.has_kgarten?(val) ? 'fa fa-check-square-o' : 'fa fa-square-o'
    color = Housing.has_kgarten?(val) ? 'green' : 'lightgrey'
    { :class => cl, :color => color }
  end

  def work_class(koatuu_code)
    rubric = params[:home_search_rubric]
    return { :places => "-" } unless rubric

    wp = Workplace.where(:koatuu_code => koatuu_code, :rubric => rubric).first
    trud = TrudGov.where(:koatuu_code => koatuu_code.slice(0,2).ljust(10, '0')).first

    places = wp.places if wp
    url = "http://www.trud.gov.ua/control/uk/index#rubId=#{rubric}&posId=0&typeSearch=1&startPos=1&browser_name=Netscape&page=0"

    { :places => places || '-', :url => url }
  end

end

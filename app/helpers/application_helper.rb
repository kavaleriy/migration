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

end

module ApplicationHelper
  def school_class(val)
    'fa fa-check-square-o' if Housing.has_school?(val)
  end
  def kgarten_class(val)
    'fa fa-check-square-o' if Housing.has_kgarten?(val)
  end
end

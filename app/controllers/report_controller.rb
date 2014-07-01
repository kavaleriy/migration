class ReportController < ApplicationController
  def amount_places
    @rep = Housing.group('koatuu_code')
  end

  def amount_by_type
  end

  def amount_of_job
  end
end

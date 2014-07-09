#encoding: utf-8

namespace :vacancies do

  desc "Load data from trud.gov.ua "
  task :crawl => :environment do
    rubrics = %w{0 2 1 6 3 4 5 8 7 9 10 12 11 13 24 14 19 18 16 17 21 20 22 23}

    Workplace.delete_all

    Housing.group(:koatuu_code).each { |rec|
      trud = TrudGov.where(:koatuu_code => rec.koatuu_code).where.not(:trud_code => [nil, '']).first
      rubrics.each {|rubric|
        vacations = getdata(trud.trud_code, rubric)

        wp = Workplace.find_or_create_by(:koatuu_code => rec.koatuu_code, :rubric => rubric).update({ :places => vacations }) if vacations > 0

        puts "CRAWL #{trud.trud_code}: :koatuu_code => #{rec.koatuu_code}, :rubric => #{rubric}, :places => #{vacations}"
      } unless trud.nil?
    }
  end

  private
  def getdata(distr_id, rub_id)
    require 'open-uri'

    url = URI("http://www.trud.gov.ua/searchDispVacRes?posId=0&distrId=#{distr_id}&typeSearch=2&rubId=#{rub_id}")
    resp = open(url).read

    resp = /countVacancies>(?<vac>\d+)<\/countVacancies/.match(resp)

    resp['vac'].to_i
  rescue => e
    msg = "TRUD.GOV.UA - can't get data: distr: #{distr_id}, rubric: #{rub_id}. \nError: (#{e.class.name}): #{e.message}"
    Rails.logger.info msg
    puts msg

    -1
  end

end

#encoding: utf-8

namespace :koatuu do

  desc "Load KOATUU from file"
  task :load => :environment do

    require 'remote_table'

    koatuu = [
      { code: "100000000", name: "АВТОНОМНА РЕСПУБЛІКА КРИМ/М.СІМФЕРОПОЛЬ"},
      { code: "110000000", name: "МІСТА АВТОНОМНОЇ РЕСПУБЛІКИ КРИМ"}
    ]

    koatuu.each do |item|
      code = item[:code]
      name = item[:name]

      binding.pry
      # Customer.collection.update( {'name' => name},
      #                             {'$set' => {'name' => new_name, 'token' => new_token }})
    end
  end

end

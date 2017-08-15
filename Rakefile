require "rake"

namespace :deploy do

  desc "Build locally"
  task :gulp_build do
    system "rm -rf _site"
    system "gulp buildForProduction"

    message = "Local build success (#{Time.now.utc})"
  end

  desc "Generate locally"
  task :production => [:gulp_build] do
    system "cp config/production/robots.txt _site/robots.txt"
  end

end
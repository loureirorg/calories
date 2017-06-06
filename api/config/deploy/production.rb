server 'ec2.learnwithdaniel.com',
       user: 'ubuntu',
       roles: %w[app db web],
       keys: %w[/home/daniel/.ssh/ec2-lwd.pem]

set :rvm_ruby_version, '2.4'
set :linked_files, %w[.env]
set :linked_dirs, %w[front-end/node_modules]

after 'deploy:set_current_revision', 'deploy:move_api_to_root'
after :deploy, 'deploy:compile_front_end', 'deploy:restart_apache'

namespace :deploy do
  task :move_api_to_root do
    on roles(:app) do
      within fetch(:release_path) do
        execute 'shopt -s dotglob'
        execute :mv, 'app front-end'
        execute :mv, 'api/* .'
      end
    end
  end

  task :compile_front_end do
    on roles(:app) do
      within fetch(:release_path).join('front-end') do
        execute :npm, 'config set jobs 1' # less memory
        # execute :npm, 'install'
        execute :npm, 'run build'
      end
    end
  end

  task :restart_apache do
    on roles(:app) do
      execute :sudo, 'service apache2 reload'
    end
  end
end

# Deployment

Deploying the web remote is done via the GitLab CI system, but there are some manual steps that need to take place
first.

## Version and Tag

In order to deploy the web remote, an new tag needs to be created. Having said that, before a new tag can be created,
we need to set up a new version of the web remote.

This is just three simple steps:

1. Update the version number in the `package.json` file
2. Commit the changes in git, push the changes up to GitLab, and request a merge
3. Once your merge request has been merged, create a new tag in GitLab

## GitLab CI

When a new tag is created, GitLab CI will automatically run, and the new version of the web remote will be deployed to
the download server.

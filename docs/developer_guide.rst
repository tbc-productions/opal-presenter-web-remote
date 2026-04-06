Developer Guide
===============

Prerequisites
-------------

In order to get started developing the web remote, you'll need to install the following on your computer:

- NodeJS
- NPM
- PNPM

Get Started
-----------

Once you have the prerequisites installed, in the root directory, run the following command:

.. code::

  pnpm install


To run the web remote, run the following command:

.. code::

  pnpm start


To build the web remote manually for deployment:

.. code::

  pnpm build --aot


To lint the web remote:

.. code::

  pnpm lint


To audit the web remote:

.. code::

  pnpm audit


To install the Playwright browsers for testing:

.. code::

  pnpm playwright install


To run unit tests on the web remote using a Chromium browser:

.. code::

  pnpm test --browsers Chromium


Deployment
----------

For deployment, see the `Deployment`_ page.


.. _Deployment: docs/deployment.rst

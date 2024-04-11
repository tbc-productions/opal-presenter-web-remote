Developer Guide
===============

Prerequisites
-------------

In order to get started developing the web remote, you'll need to install the following on your computer:

- NodeJS
- NPM
- Yarn

Get Started
-----------

Once you have the prerequisites installed, in the root directory, run the following command:

.. code::

  yarn install


To run the web remote, run the following command:

.. code::

  yarn start


To build the web remote manually for deployment:

.. code::

  yarn build --aot


To lint the web remote:

.. code::

  yarn lint


To audit the web remote:

.. code::

  yarn audit


To run unit tests on the web remote using the Chrome browser:

.. code::

  yarn test --browsers Chrome


To run unit tests on the web remote using the Microsoft Edge browser:

.. code::

  yarn test --browsers Edge


Deployment
----------

For deployment, see the `Deployment`_ page.


.. _Deployment: docs/deployment.rst

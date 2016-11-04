/*
 * Copyright © 2016 Ladr, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.ladr.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.LadrService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LadrProvider {

    private static final Logger LOG = LoggerFactory.getLogger(LadrProvider.class);

    private final DataBroker dataBroker;
    private final RpcProviderRegistry rpcProviderRegistry;
    private RpcRegistration<LadrService> serviceRegistration;

    public LadrProvider(final DataBroker dataBroker, RpcProviderRegistry rpcProviderRegistry) {
        this.dataBroker = dataBroker;
        this.rpcProviderRegistry = rpcProviderRegistry;
    }

    /**
     * Method called when the blueprint container is created.
     */
    public void init() {
        serviceRegistration = rpcProviderRegistry.addRpcImplementation(LadrService.class, new LadrImpl());
        LOG.info("LadrProvider Session Initiated");
    }

    /**
     * Method called when the blueprint container is destroyed.
     */
    public void close() {
        serviceRegistration.close();
        LOG.info("LadrProvider Closed");
    }
}
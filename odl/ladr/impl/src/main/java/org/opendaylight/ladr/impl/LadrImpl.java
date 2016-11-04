/*
 * Copyright © 2016 Ladr, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.ladr.impl;

import java.util.concurrent.Future;
import java.util.ArrayList;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.LadrService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.GetLocationIPMappingsInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.GetLocationIPMappingsOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.GetLocationIPMappingsOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.ladr.rev150105.getlocationipmappings.output.ServerLocIpInfo;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;


public class LadrImpl implements LadrService {

    @Override
    public Future<RpcResult<GetLocationIPMappingsOutput>> getLocationIPMappings(GetLocationIPMappingsInput input) {
        GetLocationIPMappingsOutputBuilder ladrBuilder = new GetLocationIPMappingsOutputBuilder();
        double latitude = input.getLocationLatitude().doubleValue();
        double longitude = input.getLocationLongitude().doubleValue();
        double range = input.getRange().doubleValue();
        LocationService  locationService = LocationService.getInstance();
        ArrayList<ServerLocIpInfo> serversInRange = (ArrayList<ServerLocIpInfo>)locationService.getServersInRange(latitude, longitude, range);
        ladrBuilder.setServerLocIpInfo(serversInRange);
        return RpcResultBuilder.success(ladrBuilder.build()).buildFuture();
    }

}